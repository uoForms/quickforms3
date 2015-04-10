/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package quickforms.sme;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import javax.mail.*;
import javax.mail.internet.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import quickforms.dao.LookupPair;

/**
 *
 * @author Priyanka Jain
 */
public abstract class UseFulMethods
{
	static public String getListAsString(List<Integer> Events)
	{
		String eventsStr = "(";
		for (int i = 0; i < Events.size(); i++)
		{
			if (i > 0)
			{
				eventsStr += ",";
			}
			eventsStr += Events.get(i).toString();
		}
		return eventsStr + ")";
	}
	
	static public List<Map> createRSContext(String oldContextStr) throws Exception
	{
		JSONParser parser = new JSONParser();
		JSONArray lang = (JSONArray) parser.parse(oldContextStr);
		List<Map> oldContextList = new ArrayList<Map>();
		for (int i = 0; i < lang.size(); i++)
		{
			Map<String, String[]> oldContext = new HashMap<String, String[]>();
			JSONObject updateRow = (JSONObject) lang.get(i);
			Set<String> keyset1 = updateRow.keySet();
			for (String fieldName : keyset1)
			{
				String value = (String) updateRow.get((Object) fieldName);
				oldContext.put(fieldName, new String[] { value });
			}
			oldContextList.add(oldContext);
			
		}
		return oldContextList;
	}
	
	static public Map<String, String> createLookUP(List<LookupPair> lookupBetaslist) throws Exception
	{
		Map<String, String> lookUP = new HashMap<String, String>();
		for (LookupPair fieldName : lookupBetaslist)
		{
			lookUP.put(fieldName.right, fieldName.right2);
		}
		return lookUP;
	}
	
	static public boolean contextExist(Object attribute)
	{
		if (attribute == null)
		{
			return false; // it doesn't exits'
		}
		if (attribute instanceof String)
		{
			return (!((String) attribute).isEmpty()); // it doesn't exits'
		}
		if (attribute instanceof Map)
		{
			return (!((Map) attribute).isEmpty()); // it doesn't exits'
		}
		return true;
	}
	
	static public String timeStampFormat(String dateStamp) throws Exception
	{
		String dateTimeStamp = null;
		final String DB_FORMAT = "yyyy-MM-dd HH:mm:ss"; // database format
		final String NEW_FORMAT = "MM/dd/yyyy HH:mm"; // frontend format and
														// created date format
														// "yyyy/MM/dd HH:mm"
		Date date = null;
		// SimpleDateFormat formatter = new SimpleDateFormat();
		if (dateStamp.contains("/"))
		{
			date = getDateObj(dateStamp, NEW_FORMAT);
			// formatter.applyPattern(NEW_FORMAT);
		}
		if (dateStamp.contains("-"))
		{
			date = getDateObj(dateStamp, DB_FORMAT);
			// formatter.applyPattern(DB_FORMAT);
		}
		// date = formatter.parse(dateStamp);
		// formatter.applyPattern(NEW_FORMAT);
		dateTimeStamp = getStringDateObj(date, NEW_FORMAT);
		return dateTimeStamp;
		
	}
	
	static public Date getDateObj(String dateStamp, String format) throws Exception
	{
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		Date date = formatter.parse(dateStamp);
		return date;
	}
	
	static public String getStringDateObj(Date dateObj, String format) throws Exception
	{
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		String dateTimeStamp = formatter.format(dateObj);
		return dateTimeStamp;
	}
	
	static public void sendEmail(String d_email, String pwd, String toAddress, String m_subject, String message) throws Exception
	{
		final String from = d_email;
		final String password = pwd;
		class SMTPAuthenticator extends Authenticator
		{
			
			public PasswordAuthentication getPasswordAuthentication()
			{
				return new PasswordAuthentication(from, password);
			}
		}
		
		// String d_uname = "email";
		// String d_password = "password";
		String d_host = "smtp.gmail.com";
		String d_port = "465"; // 465,587
		
		Properties props = new Properties();
		props.put("mail.smtp.user", from);
		props.put("mail.smtp.host", d_host);
		props.put("mail.smtp.port", d_port);
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.debug", "true");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.socketFactory.port", d_port);
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.socketFactory.fallback", "false");
		
		SMTPAuthenticator auth = new SMTPAuthenticator();
		Session session = Session.getInstance(props, auth);
		session.setDebug(true);
		
		MimeMessage msg = new MimeMessage(session);
		
		// msg.setText(message);
		// Send the actual HTML message, as big as you like
		
		msg.setContent(message, "text/html");
		msg.setSubject(m_subject);
		msg.setFrom(new InternetAddress(from));
		
		String [] toAddresses = toAddress.split(",");
		for(String address : toAddresses)
		{
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(address));
		}
		
		Transport transport = session.getTransport("smtps");
		transport.connect(d_host, 465, from, password);
		transport.sendMessage(msg, msg.getAllRecipients());
		transport.close();
		
	}
	
	static public String getApp_PropertyFile_Path(String app, String canonicalFilePath)
	{
		String fileName = (Character.toString(app.charAt(0)).toUpperCase() + app.substring(1));
		System.out.println(canonicalFilePath);
		String[] str_array = canonicalFilePath.split("\\.");
		String folderPath = "";
		for (int i = 0; i < ((str_array.length) - 1); i++)
		{
			folderPath = folderPath + str_array[i] + "/";
		}
		String filePath = folderPath + fileName + "ConfigFile.properties";
		return filePath;
	}
	
	static public Map<String, String> getProperties(String filePath) throws IOException
	{
		Properties prop = new Properties();
		
		InputStream inputStream = new Object()
		{
		}.getClass().getClassLoader().getResourceAsStream(filePath);
		prop.load(inputStream);
		if (inputStream == null)
		{
			throw new FileNotFoundException("file '" + filePath + "' not found ");
		}
		
		Date time = new Date(System.currentTimeMillis());
		System.out.println(time);
		Map<String, String> map = new HashMap<String, String>((Map) prop);
		return map;
		
	}
	
}
