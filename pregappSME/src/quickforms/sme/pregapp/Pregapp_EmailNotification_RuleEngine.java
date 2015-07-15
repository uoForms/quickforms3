/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package quickforms.sme.pregapp;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.sql.DataSource;

import quickforms.sme.*;
import quickforms.dao.Database;
import quickforms.dao.LookupPair;
import quickforms.sme.RuleEngine;

/**
 *
 * @author Ben Eze
 */
public class Pregapp_EmailNotification_RuleEngine implements RuleEngine
{
	private final int minimumWeek = -4;
	private String senderEmail = "";
	private String senderPassword="";
	private Boolean testMode=false;
	private final String adminUserEmails = "eze.ben@gmail.com,veena.chhattani@gmail.com";
	
    /***
     * Processes and sends notifications for all those that match the pregnancy anniversary
     * @param context
     * @param ds
     * @param factID
     * @param oldContextStr
     * @throws Exception
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public void process(Map<String, String[]> context, DataSource ds,String factID, List<List<LookupPair>> oldContextStr) throws Exception
    { 
    	//Get context details 
    	try{
	    	
	    	this.testMode = Boolean.parseBoolean(context.get("chkMode")[0]);	 
	    	
	    	System.out.println(String.format("Test mode:%s", context.get("chkMode")[0].toString()));
	    	System.out.println(String.format("Test mode:%s", this.testMode.toString()));
	    	
    	}catch (Exception e) {    		
    		System.out.println(String.format("Exception reading form parameters: %s", e.getMessage()));
    	}
    	
    	//get all User 
		Database db = new Database(ds);
		String app=context.get("app")[0];
		String lkup_UsersJSon = db.getResultSet(app, "lkup_Users", null, null, null, null);
		List<Map> allUsersLkUp = UseFulMethods.createRSContext(lkup_UsersJSon);
		System.out.println(String.format("Results found: %d", allUsersLkUp.size()));
		int emailsSent=0;
		String subscriberEmailConfirmation = "";
		
		for (Map<String, String[]> row : allUsersLkUp) //for each user
		{
			//sent email and add to db
			String userKey = row.get("usersKey")[0];
			String userEmail = row.get("Email")[0];
			
			int currWeek = getNotificationCurrentWeek(row.get("DueDate")[0]);  	//calculate user week
			
			//System.out.println(String.format("Details for user:%s, key:%s, current week:%d Due Date:%s ", userEmail, userKey, currWeek, row.get("DueDate")[0]));
			
			if (currWeek >= minimumWeek)
			{					
				String messageLog = String.format("Email sent for user:%s, key:%s, current week:%d ", userEmail, userKey, currWeek);
				
				sendNotificationEmail(row,app, currWeek); 
				System.out.println(messageLog);
				
				emailsSent +=1;
				if(subscriberEmailConfirmation=="")
					subscriberEmailConfirmation = messageLog;
				else
					subscriberEmailConfirmation += "<br/>" + messageLog;
			}			
		}
		
		//Send confirmation daily to show that the messages were actually sent
		this.sendAdminConfirmationEmail(app, emailsSent, subscriberEmailConfirmation);
    }
    
    /**
     * Sends the notification email congratulating the pregnant mom on another weekly anniversary
     * @param row
     * @param app
     * @param currWeek
     * @return
     * @throws IOException
     * @throws Exception
     */
    private String[] sendNotificationEmail(Map<String, String[]> row ,String app, int currWeek) throws IOException, Exception
	{		
		String canonicalFilePath=new Pregapp_EmailNotification_RuleEngine().getClass().getCanonicalName();
		String filePath=UseFulMethods.getApp_PropertyFile_Path(app,canonicalFilePath);
		Map<String, String> map=UseFulMethods.getProperties(filePath);
		
		String weekTitle = "";
		String message = "";		
		String recipientEmail = row.get("Email")[0];
		
		this.senderEmail = map.get("senderEmail");
		this.senderPassword = map.get("password");
		
		//If we are testing, send the email to ourselves
		if(this.testMode){
			recipientEmail = adminUserEmails;
			message = "";
			message = "This is a test notification.....";
		}
		
		String link= "http://quickforms3.eecs.uottawa.ca/francine/week"+ currWeek + ".html?id=" + (currWeek + 1) ;
		String warningSignsLink = "http://quickforms3.eecs.uottawa.ca/francine/warning_signs_trimester_1.html?id=61";
		String signsOfLabour = "http://quickforms3.eecs.uottawa.ca/francine/signs_of_labor.html?id=65";
		
		if(currWeek >= 0){
			
			switch(currWeek){
				case 0:
					weekTitle = "new pregnancy";
					break;
				case 1:
					weekTitle = "<b>first week</b> of pregnancy";
					break;
				case 2:
					weekTitle = "<b>second week</b> of pregnancy";
					break;
				case 3:
					weekTitle = "<b>third week</b> of pregnancy";
					break;
				default:
					weekTitle = "<b>" + currWeek + "th </b>" + "week of pregnancy";
					break;
			}	
			
			if(currWeek > 12)
				warningSignsLink = "http://quickforms3.eecs.uottawa.ca/francine/warning_signs_trimester_1.html?id=61";
			else if(currWeek > 26)
				warningSignsLink = "http://quickforms3.eecs.uottawa.ca/francine/warning_signs_trimester_3.html?id=63";
			
			//General congratulations message
			message += "<h1> Dear Subscriber </h1> " +
							 "<p>Congratulations on your " + weekTitle + "! </p>" +
			  				 "<p> Lets continue your happy journey together!<br><br>Please click on below link for your " 
											+ weekTitle + " week guidelines <br><br>"+
											"<a href=\""+link+ "\">"+link +
											"</a><br><br><br>Note: If a link above doesn't work, please copy and paste the URL into a browser.</p>";
			
			//Add the appropriate warning signs for the trimester. 
			message += "<p>Please read through the following <a href='" + warningSignsLink +
						"'>warning signs</a> and contact your physician immediately if you notice any of those signs</p>";
			
			//Add the signs of labour for those up to 38 weeks pregnant
			if(currWeek >= 38){
				message += "<p>As you getting closer to your due date, please read through these <a href='" + signsOfLabour +
						"'>signs of labour</a> as well.</p>";
			}
		}else{
			
			link= "http://quickforms3.eecs.uottawa.ca/francine/new_born_wk_"+ Math.abs(currWeek) + ".html";
			String advantageOfPregnancyLink = "http://quickforms3.eecs.uottawa.ca/francine/adv_of_breast_feeding.html?id=66";
			
			//Section for new born
			switch(currWeek){
				case -1:
					weekTitle = "new born";
					link +="?id=67";
					break;
				case -2:
					weekTitle = "<b>two weeks old baby</b>";
					link +="?id=68";
					break;
				case -3:
					weekTitle = "<b>three weeks old baby</b>";
					link +="?id=69";
					break;
				case -4:
					weekTitle = "<b>4 weeks old baby</b>";
					link +="?id=70";
					break;
				default:
					weekTitle = "<b>" + Math.abs(currWeek) + "th </b>" + "old baby";
					link = advantageOfPregnancyLink;
					break;
			}	
			
			message += "<h1> Dear Subscriber </h1> " +
							 "<p>Congratulations on your " + weekTitle + "! </p>" +
			  				 "<p> Lets continue your happy journey together!<br><br>Please click on below link for your " 
											+ weekTitle + " new born guidelines <br><br>"+
											"<a href=\""+link+ "\">" + link +
											"</a><br><br><br>Note: If a link above doesn't work, please copy and paste the URL into a browser.</p>";			
		}
		
		UseFulMethods.sendEmail(this.senderEmail, this.senderPassword, recipientEmail, "Francine alert", message);
		String[]  params= new String[2];
		params[0]=senderEmail;
		params[1]=message;
		
		return params;
	}
    
    /**
     * sends confirmation email to adminitrators
     * @param app
     * @param numberOfEmails
     */
	private void sendAdminConfirmationEmail(String app, int numberOfEmails, String messageLog){
				
		try {
			String canonicalFilePath=new Pregapp_EmailNotification_RuleEngine().getClass().getCanonicalName();
			String filePath=UseFulMethods.getApp_PropertyFile_Path(app,canonicalFilePath);
			Map<String, String> map=UseFulMethods.getProperties(filePath);
						
			String message = String.format("%d subscriber emails have been sent! <br/><br/> %s", numberOfEmails, messageLog);		
					
			this.senderEmail = map.get("senderEmail");
			this.senderPassword = map.get("password");
			UseFulMethods.sendEmail(this.senderEmail, this.senderPassword, this.adminUserEmails, "Daily notification summary", message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * gets the current week if the due date anniversary is the week day as today
	 * @param dueDateStr Due date for the pregnancy
	 * @return number between minimumWeek - 40
	 * @throws Exception
	 */
	private int getNotificationCurrentWeek(String dueDateStr) throws Exception{
		
		Integer minimumValue = minimumWeek - 1;
		
		if(dueDateStr == null || dueDateStr.trim().isEmpty())		
			return minimumValue;
		
		//Get the date format
		DateFormat formatter = DateFormat.getDateInstance(DateFormat.SHORT, Locale.getDefault());
		//String pattern = ((SimpleDateFormat)formatter).toPattern();
		//System.out.println(pattern);
		
		//Fix the due date into a date		
		Date dueDate = formatter.parse(dueDateStr);
		
		//Get the current date
		String curDateStr = formatter.format(System.currentTimeMillis());
		Date curDate = formatter.parse(curDateStr);
		
		//If the current date is not the weekly anniversary, 
		//then we are done		
		Calendar calDueDate = Calendar.getInstance();
		Calendar calCurrentDate = Calendar.getInstance();
		
		calDueDate.setTime(dueDate);
		calCurrentDate.setTime(curDate);
		
		//System.out.println("Due date day of the week: " + calDueDate.get(Calendar.DAY_OF_WEEK));
		//System.out.println("Current day of the week: " + calCurrentDate.get(Calendar.DAY_OF_WEEK));
		
		if(calDueDate.get(Calendar.DAY_OF_WEEK)
				!= calCurrentDate.get(Calendar.DAY_OF_WEEK))
			return minimumValue;
		
		//Today is the weekly anniversary, we go ahead and process
		//the number of weeks		
		int dueDays = (int) (long) (TimeUnit.DAYS.convert((dueDate.getTime() - curDate.getTime())
				, TimeUnit.MILLISECONDS));
				
		double weeks = ((double) dueDays / 7.0);
		
		
		if(weeks < this.minimumWeek) //Way beyond due date
			return minimumValue;
		else if(weeks >= 0)			
			return (int) (40.0 - weeks); //Before due date
		else
			return (int) weeks; //After delivery up to the minimum allowed
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
    
    
    public static void main(String [] args)
	{
    	System.out.println("Testing");
    	Pregapp_EmailNotification_RuleEngine pregappRuleEngine = new Pregapp_EmailNotification_RuleEngine();
    	
    	try {
    		String currentWeek = "10/08/2014";
			System.out.println(pregappRuleEngine.getNotificationCurrentWeek(currentWeek));
			
			currentWeek = "31/05/2015";
			System.out.println(pregappRuleEngine.getNotificationCurrentWeek(currentWeek));
			
			currentWeek = "21/06/2015";
			System.out.println(pregappRuleEngine.getNotificationCurrentWeek(currentWeek));
						
			currentWeek = "11/03/2015";
			System.out.println(pregappRuleEngine.getNotificationCurrentWeek(currentWeek));
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
