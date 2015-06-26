/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.pregapp;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.Database;
import quickforms.dao.LookupPair;
import quickforms.sme.RuleEngine;
import quickforms.sme.UseFulMethods;

/**
 *
 * @author Priyanka Jain
 */
public class Pregapp_Unsubscribe_RuleEngine implements RuleEngine
{
	public void process(Map<String, String[]> context, DataSource ds,String factID, List<List<LookupPair>> oldContextStr) throws Exception
	{
		if (!(context.containsKey("sendEmail")))
			
		{
			Database db = new Database (ds);
			String whereClause=" Email ='"+context.get("Email")[0]+"'";
			String lkup_UsersJSon = db.getResultSet(context.get("app")[0], "getUserDetails", null, whereClause, null, null);
			List<Map> allUsersLkUp = UseFulMethods.createRSContext(lkup_UsersJSon);
			if(allUsersLkUp.size()>0)
			{
				String msg=null;
				String subject=null;
				String DueDate=null;
				String UsersKey =null;
				for (Map<String, String[]> row : allUsersLkUp) //for each user
				{
					UsersKey = row.get("usersKey")[0];
					//delete the fact
					db.deleteFact(context.get("app")[0], "Users", UsersKey);
					DueDate=row.get("DueDate")[0];
				}	
				
			    
				subject="Email Removed";
				msg="You have Unscubribed from Francine Application";
				//send an email with this msg
				//get senderEmail and Password from propertyfile
				String senderEmail=sendEmailProcess(context, subject, msg);

				//update in tempMSg table
				Map<String, String[]> updateFact = setOldContext(context,DueDate,factID,UsersKey);
				db.putFactProcess(updateFact, db);
				Map<String, String[]> insertFact = setNewContext(context.get("app")[0],"emailSent",factID, msg, senderEmail);
				db.putFactProcess(insertFact, db);
			}	
		}
		
	}
	
	
	
	
	
	
	
	public String  sendEmailProcess(Map<String, String[]> context,String subject,String msg)
			throws IOException, Exception
	{
		String canonicalFilePath=new Pregapp_Unsubscribe_RuleEngine().getClass().getCanonicalName();
		String filePath=UseFulMethods.getApp_PropertyFile_Path(context.get("app")[0],canonicalFilePath);
		Map<String, String> map=UseFulMethods.getProperties(filePath);
		String senderEmail = map.get("senderEmail");
		String password = map.get("password");
		String message = "<h1> Dear User</h1><br><p>"+msg+ "</p>";
		UseFulMethods.sendEmail(senderEmail, password, context.get("Email")[0], subject, message);
		return senderEmail;
	}
	//update UnSubscribe Table Fact 
	public Map<String, String[]> setOldContext(Map<String, String[]> context, String DueDate,String factID,String UserTabelKey ) throws Exception
	{
		Map<String, String[]> newContext = new HashMap<String, String[]>(context);
		newContext.put("updateid", new String[]{factID});
		newContext.put("DueDate", new String[]{DueDate});
		newContext.put("UserTabelRefID", new String[]{UserTabelKey});
		newContext.remove("createdDate");
		newContext.put("sendEmail", new String[]{"false"});
		return newContext;
	}
	//set emailSent Fact 
	public Map<String, String[]> setNewContext(String app,String factTable,String UsersKey, String msg,String senderEmail ) throws Exception
	{
		Map<String, String[]> newContext = new HashMap<String, String[]>();
		newContext.put("app", new String[]{app});
		newContext.put("factTable", new String[]{factTable});		
		newContext.put("senderEmail", new String[]{senderEmail});
		newContext.put("usersK", new String[]{UsersKey});
		newContext.put("message", new String[]{msg});
		newContext.put("emailType", new String[]{"3"});
		newContext.put("sendEmail", new String[]{"false"});
		return newContext;
	}
}
