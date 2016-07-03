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
public class Pregapp_Users_RuleEngine implements RuleEngine
{
	public void process(Map<String, String[]> context, DataSource ds,String factID, List<List<LookupPair>> oldContextStr) throws Exception
	{
		if (!(context.containsKey("sendEmail")))
			
		{
			Database db = new Database(ds);
			String whereClause=" Email ='"+context.get("Email")[0]+"'";
			String lkup_UsersJSon = db.getResultSet(context.get("app")[0], "getUserDetails", null, whereClause, null, null);
			List<Map> allUsersLkUp = UseFulMethods.createRSContext(lkup_UsersJSon);
			String msg=null;
			String subject=null;
			String UsersKeyFact=null;
			String emailType=null;
			if(allUsersLkUp.size()>1)
			{
				for (Map<String, String[]> row : allUsersLkUp) //for each user
				{
					String UsersKey = row.get("usersKey")[0];
					if(!UsersKey.equals(factID))
					{
						//delete the fact
						db.deleteFact(context.get("app")[0], context.get("factTable")[0], factID);
						UsersKeyFact=UsersKey;
						
					}
					
				}
				subject="DueDate changed";
				msg="You have successfully updated your due date as "+context.get("DueDate")[0];
				emailType="4";
				Map<String, String[]> updateFact = setOldContext(context,UsersKeyFact);
				db.putFactProcess(updateFact, db);
			}
			else
			{
				subject="WELCOME MESSAGE";
				msg="You have successfully subscribe to CelebrateCreation App and your due date is "+context.get("DueDate")[0];
				emailType="2";
				UsersKeyFact=factID;
			}
			//send an email with this msg
			//get senderEmail and Password from propertyfile
			String senderEmail=sendEmailProcess(context, subject, msg);

			//update in tempMSg table
			Map<String, String[]> newContext = setNewContext(context.get("app")[0],"emailSent",UsersKeyFact, msg,emailType, msg ,senderEmail);
			db.putFactProcess(newContext, db);
		}	
	}
	
	
	public String sendEmailProcess(Map<String, String[]> context,String subject,String msg)
			throws IOException, Exception
	{
		String canonicalFilePath=new Pregapp_Users_RuleEngine().getClass().getCanonicalName();
		String filePath=UseFulMethods.getApp_PropertyFile_Path(context.get("app")[0],canonicalFilePath);
		Map<String, String> map=UseFulMethods.getProperties(filePath);
		String senderEmail = map.get("senderEmail");
		String password = map.get("password");
		String message = "<h1> Dear Subscriber</h1><br><p>"+msg+ "</p>";
		UseFulMethods.sendEmail(senderEmail, "", password, context.get("Email")[0], subject, message);
		return senderEmail;
	}
	public Map<String, String[]> setOldContext(Map<String, String[]> context, String factID ) throws Exception
	{
		Map<String, String[]> newContext = new HashMap<String, String[]>(context);
		newContext.put("updateid", new String[]{factID});
		newContext.put("sendEmail", new String[]{"false"});
		newContext.remove("createdDate");
		return newContext;
	}
	public Map<String, String[]> setNewContext(String app,String factTable,String factID, String msg,String emailType,String message ,String senderEmail ) throws Exception
	{ 
		Map<String, String[]> newContext = new HashMap<String, String[]>();
		newContext.put("app", new String[]{app});
		newContext.put("factTable", new String[]{factTable});		
		newContext.put("usersK", new String[]{factID});
		newContext.put("message", new String[]{message});
		newContext.put("senderEmail", new String[]{senderEmail});
		newContext.put("emailType", new String[]{emailType});
		newContext.put("sendEmail", new String[]{"false"});
		return newContext;
	}

	
}
