/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package quickforms.sme.pregapp;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.sql.DataSource;

import quickforms.sme.*;
import quickforms.dao.Database;
import quickforms.dao.LookupPair;
import quickforms.sme.RuleEngine;

/**
 *
 * @author Priyanka Jain
 */
public class Pregapp_EmailSent_RuleEngine implements RuleEngine
{

	public void process(Map<String, String[]> context, DataSource ds,String factID, List<List<LookupPair>> oldContextStr) throws Exception
	{
		if (!(context.containsKey("sendEmail")))
		{
			//get all User 
			Database db = new Database(ds);
			String app=context.get("app")[0];
			String lkup_UsersJSon = db.getResultSet(app, "lkup_Users", null, null, null, null);
			List<Map> allUsersLkUp = UseFulMethods.createRSContext(lkup_UsersJSon);
			
			for (Map<String, String[]> row : allUsersLkUp) //for each user
			{
				Integer currWeek = getCurrWeek(row.get("DueDate")[0]);  	//calculate user week

				if (currWeek != null)
				{
					//sent email and add to db
					String UsersKey = row.get("usersKey")[0];
					String[] params=sendEmailProcess(row,app,String.valueOf(currWeek)); 
					String senderEmail=params[0];
					String message=params[1];
					Map<String, String[]> updateFact = setOldContext(context, factID, senderEmail);
					db.putFactProcess(updateFact, db);
					Map<String, String[]> emailSentFact = setNewContext(context,UsersKey, message, currWeek, factID,senderEmail);
					db.putFactProcess(emailSentFact, db);
				}
			}
		}
	}
	
	
	
	
	
    public String[] sendEmailProcess(Map<String, String[]> row ,String app,String currWeek) throws IOException, Exception
	{
		//get senderEmail and Password from propertyfile
		String canonicalFilePath=new Pregapp_EmailSent_RuleEngine().getClass().getCanonicalName();
		String filePath=UseFulMethods.getApp_PropertyFile_Path(app,canonicalFilePath);
		Map<String, String> map=UseFulMethods.getProperties(filePath);
		String senderEmail = map.get("senderEmail");
		String password = map.get("password");
		String link= "http://quickforms3.eecs.uottawa.ca/francine/week"+ currWeek + ".html?id="+ String.valueOf(Integer.parseInt(currWeek) + 1) ;
		String message = "<h1> Dear Subscriber " +
		  				 "</h1><br><p> Welcome to the Pregnancy Guide Application! <br>Lets start your happy journey together!<br><br>Please click on below link for your " 
										+ currWeek + " week guidelines <br><br>"+
										"<a href=\""+link+ "\">"+link +
										"</a><br><br><br>Note: If a link above doesn't work, please copy and paste the URL into a browser.</p>";
		UseFulMethods.sendEmail(senderEmail, password, row.get("Email")[0], String.valueOf(currWeek), message);
		String[]  params= new String[2];
		params[0]=senderEmail;
		params[1]=message;
		
		return params;

	}
	public Integer getCurrWeek(String dueDateStr) throws Exception
	{
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		Date dueDate = formatter.parse(dueDateStr);
		String curDateStr = formatter.format(System.currentTimeMillis());
		Date curDate = formatter.parse(curDateStr);
		Calendar cal = Calendar.getInstance();
		cal.setTime(dueDate);
		int dueDateDay = cal.get(Calendar.DAY_OF_WEEK);
		cal.setTime(curDate);
		int curDateDay = cal.get(Calendar.DAY_OF_WEEK);
		Integer currWeek = null;
		if (dueDateDay == curDateDay) // same day of the week
		{
			long daysDiff = dueDate.getTime() - curDate.getTime();
			if (daysDiff == 0)   //today is due date
			{
				return (currWeek = 40);
			}

			int dueDays = (int) (long) (TimeUnit.DAYS.convert(daysDiff, TimeUnit.MILLISECONDS));
			if (dueDays > 0)
			{
				int weekLeft = ((int) (double) (dueDays / 7));
				if (weekLeft>40)  // that means invalid due date
				{
					return null;
				}
				if ((dueDays % 7) > 0)  
				{
					weekLeft = weekLeft + 1;  // addung ie week for remaining days
				}
				currWeek = 40 - weekLeft;
				//Date curDate=UseFulFunction.getDateObj(curDateStr,"yyyy-MM-dd HH:mm"); 
				//System.out.println(dueDate + "  " + curDate + " " + dueDays + "   " + currWeek);
			}

		}
		return currWeek;
	}

	public Map<String, String[]> setNewContext(Map<String, String[]> context,String UsersKey, String message, Integer currWeek, String factID,String senderEmail) throws Exception
	{
		Map<String, String[]> newContext = new HashMap<String, String[]>(context);
		newContext.put("senderEmail", new String[]{senderEmail});
		newContext.put("weeksK", new String[]{String.valueOf(currWeek)});
		newContext.put("usersK", new String[]{UsersKey});
		newContext.put("message", new String[]{message});
		newContext.put("emailType", new String[]{"1"});
		newContext.put("requestNumber", new String[]{factID});
		newContext.put("sendEmail", new String[]{"false"});
		return newContext;
	}
    public Map<String, String[]> setOldContext(Map<String, String[]> context,String factID,String senderEmail) throws Exception
	{
		Map<String, String[]> newContext = new HashMap<String, String[]>(context);
		newContext.put("senderEmail", new String[]{senderEmail});
		newContext.put("updateid", new String[]{factID});
		newContext.put("message", new String[]{"Initiation for Weekly Email Request"});
		newContext.remove("createdDate");
		newContext.put("sendEmail", new String[]{"false"});
		
		return newContext;
	}
}
