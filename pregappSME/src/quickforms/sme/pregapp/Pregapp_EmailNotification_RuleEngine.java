/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package quickforms.sme.pregapp;

import java.io.IOException;
import java.text.DateFormat;
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

/**
 * @author Ben Eze
 */
public class Pregapp_EmailNotification_RuleEngine implements RuleEngine {
    private final int minimumWeek = 0;
    private final int maximumWeek = 40;
    private String senderAlias="";
    private String senderEmail = "";
    private String senderPassword = "";
    private Boolean testMode = false;
    private final String adminUserEmails = "eze.ben@gmail.com";
    
        
    /***
     * Processes and sends notifications for all those that match the pregnancy anniversary
     *
     * @param context
     * @param ds
     * @param factID
     * @param oldContextStr
     * @throws Exception
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public void process(Map<String, String[]> context, DataSource ds, String factID, List<List<LookupPair>> oldContextStr) throws Exception {
        //Get context details
        try {

            this.testMode = Boolean.parseBoolean(context.get("chkMode")[0]);

            System.out.println(String.format("Test mode:%s", context.get("chkMode")[0].toString()));
            System.out.println(String.format("Test mode:%s", this.testMode.toString()));

        } catch (Exception e) {
            System.out.println(String.format("Exception reading form parameters: %s", e.getMessage()));
        }

        //Pull the pregapp email settings. If this fails, go ahead and use the default
        Pregapp_EmailNotification_Settings settings = UseFulMethods.getPregappEmailSettings();
        
        //get all Users
        Database db = new Database(ds);
        String app = context.get("app")[0];
        String lkup_UsersJSon = db.getResultSet(app, "lkup_Users", null, null, null, null);
        List<Map> allUsersLkUp = UseFulMethods.createRSContext(lkup_UsersJSon);
        System.out.println(String.format("Results found: %d", allUsersLkUp.size()));
        int emailsSent = 0;
        String subscriberEmailConfirmation = "";

        for (Map<String, String[]> row : allUsersLkUp) //for each user
        {
        	try{
        		//sent email and add to db
                String userKey = row.get("usersKey")[0];
                String userEmail = row.get("Email")[0];

                int currWeek = getNotificationCurrentWeek(UseFulMethods.getDateFromString(row.get("DueDate")[0]));    //calculate user week

                System.out.println(String.format("Details for user:%s, key:%s, current week:%d Due Date:%s ", userEmail, userKey, currWeek, row.get("DueDate")[0]));

                if (currWeek >= minimumWeek && currWeek <= maximumWeek) {
                    String messageLog = String.format("Email sent for user:%s, key:%s, current week:%d ", userEmail, userKey, currWeek);

                    sendNotificationEmail(settings, row, app, currWeek);
                    System.out.println(messageLog);

                    emailsSent += 1;
                    if (subscriberEmailConfirmation == "")
                        subscriberEmailConfirmation = messageLog;
                    else
                        subscriberEmailConfirmation += "<br/>" + messageLog;
                }
        		
        	}catch(Exception e){
        		System.out.println(String.format("Exception sending email for %s: %s", row.get("Email")[0], e.getMessage()));
        	}            
        }

        //Send confirmation daily to show that the messages were actually sent
        this.sendAdminConfirmationEmail(settings, emailsSent, subscriberEmailConfirmation);
    }

    /**
     * Sends the notification email congratulating the pregnant mom on another weekly anniversary
     *
     * @param row
     * @param app
     * @param currWeek
     * @return
     * @throws IOException
     * @throws Exception
     */
    public String[] sendNotificationEmail(Pregapp_EmailNotification_Settings settings, Map<String, String[]> row, String app, int currWeek) throws IOException, Exception {
        
    	this.senderEmail = settings.getDefaultSenderEmail();
    	this.senderAlias = settings.getDefaultSenderAlias();
    	this.senderPassword = settings.getDefaultSenderPassword();
    	
        String subject = settings.getSubjectTemplate().replace("@@Subscriber", "Subscriber").replace("@@WeekNumber", Integer.toString(currWeek));        
        String message = settings.getBodyTemplate().replace("@@WeekNumber", Integer.toString(currWeek)).replace("@@Subscriber", "Subscriber");
        String recipientEmail = row.get("Email")[0];

        //If we are testing, send the email to ourselves
        if (this.testMode) {
            recipientEmail = settings.getAdminEmails();
            message = "This is a test notification.....";
        }

        UseFulMethods.sendEmail(this.senderEmail, this.senderAlias, this.senderPassword, recipientEmail, subject, message);
        String[] params = new String[2];
        params[0] = senderEmail;
        params[1] = message;

        return params;
    }

    /**
     * sends confirmation email to administrators
     *
     * @param app
     * @param numberOfEmails
     */
    private void sendAdminConfirmationEmail(Pregapp_EmailNotification_Settings settings, int numberOfEmails, String messageLog) {

        try {
            
        	this.senderEmail = settings.getDefaultSenderEmail();
        	this.senderAlias = settings.getDefaultSenderAlias();
        	this.senderPassword = settings.getDefaultSenderPassword();        	
            
            String message = String.format("%d subscriber emails have been sent! <br/><br/> %s", numberOfEmails, messageLog);            
            UseFulMethods.sendEmail(this.senderEmail, this.senderAlias, this.senderPassword, this.adminUserEmails, "Daily notification summary", message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Map<String, String[]> setNewContext(Map<String, String[]> context, String UsersKey, String message, Integer currWeek, String factID, String senderEmail) throws Exception {
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

    public Map<String, String[]> setOldContext(Map<String, String[]> context, String factID, String senderEmail) throws Exception {
        Map<String, String[]> newContext = new HashMap<String, String[]>(context);
        newContext.put("senderEmail", new String[]{senderEmail});
        newContext.put("updateid", new String[]{factID});
        newContext.put("message", new String[]{"Initiation for Weekly Email Request"});
        newContext.remove("createdDate");
        newContext.put("sendEmail", new String[]{"false"});

        return newContext;
    }

    /**
     * gets the current week if the due date anniversary is the week day as today
     *
     * @param dueDateStr Due date for the pregnancy
     * @return number between minimumWeek - 40
     * @throws Exception
     */
    private int getNotificationCurrentWeek(Date dueDate) throws Exception {

        Integer minimumValue = minimumWeek - 1;

        if (dueDate == null)
            return minimumValue;

        //Get the date format
        DateFormat formatter = DateFormat.getDateInstance(DateFormat.SHORT, Locale.getDefault());
    
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

        if (calDueDate.get(Calendar.DAY_OF_WEEK)
                != calCurrentDate.get(Calendar.DAY_OF_WEEK))
            return minimumValue;

        //Today is the weekly anniversary, we go ahead and process
        //the number of weeks
        int dueDays = (int) (long) (TimeUnit.DAYS.convert((dueDate.getTime() - curDate.getTime())
                , TimeUnit.MILLISECONDS));

        double weeks = ((double) dueDays / 7.0);


        if (weeks < this.minimumWeek) //Way beyond due date
            return minimumValue;
        else if (weeks >= 0)
            return (int) (40.0 - weeks); //Before due date
        else
            return (int) weeks; //After delivery up to the minimum allowed
    }

    
    public static void main(String[] args) {
    	
    	try{
    		UseFulMethods.sendEmail("autoReplyPregApp@gmail.com", "Test Alias", "autoReplyPregApp1", "eze.ben@gmail.com", "Daily notification summary", "Test message");
    		UseFulMethods.sendEmail("autoReplyPregApp@gmail.com", "Test Alias", "autoReplyPregApp1", "eze.ben@gmail.com", "Daily notification summary", "Test message");
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	
    	System.out.println("Testing");
        Pregapp_EmailNotification_RuleEngine pregappRuleEngine = new Pregapp_EmailNotification_RuleEngine();
                
        try {
            String currentWeek = "08/10/2015";
            System.out.println(pregappRuleEngine.getNotificationCurrentWeek(UseFulMethods.getDateFromString(currentWeek)));

            currentWeek = "31/05/2016";
            System.out.println(pregappRuleEngine.getNotificationCurrentWeek(UseFulMethods.getDateFromString(currentWeek)));

            currentWeek = "21/06/2016";
            System.out.println(pregappRuleEngine.getNotificationCurrentWeek(UseFulMethods.getDateFromString(currentWeek)));

            currentWeek = "11/03/2016";
            System.out.println(pregappRuleEngine.getNotificationCurrentWeek(UseFulMethods.getDateFromString(currentWeek)));
            
            currentWeek = "20/10/2016";
            System.out.println(pregappRuleEngine.getNotificationCurrentWeek(UseFulMethods.getDateFromString(currentWeek)));

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        System.out.println("Testing - sending emails");
        Pregapp_EmailNotification_Settings settings = UseFulMethods.getPregappEmailSettings();
        
        Map<String, String[]> row = new HashMap<String, String[]>();
        String[] email = new String[] {"eze.ben@gmail.com"};
        row.put("Email", email);
        
        try {
			pregappRuleEngine.sendNotificationEmail(settings, row, "", 31);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
