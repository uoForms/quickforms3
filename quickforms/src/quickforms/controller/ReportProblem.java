package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import quickforms.dao.Logger;
import quickforms.sme.UseFulMethods;

@WebServlet(name = "ReportProblem", urlPatterns = { "/reportProblem" })
public class ReportProblem extends HttpServlet
{
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		/*
		 * This is the parameter map for the problem report
		 * 
		 * app=rpp&factTable=reportProblem&updateid=null&email=riyas%40somewhere.com&
		 * phoneNumber=111-222-3333&problem=Sample%20problem%20report%20for%20RPP&
		 * addedBy=admin
		 */
		
		Map<String, String[]> inParams = request.getParameterMap();
		final String app = request.getParameter("app");
		System.out.println("app"+ app);
		final String userName = request.getParameter("addedBy");
		System.out.println("username"+ userName);
		final String userEmail = request.getParameter("email");
		System.out.println("userEmail"+ userEmail);
		final String userPhone = request.getParameter("phoneNumber");
		System.out.println("phonenumber"+ userPhone);
		
		final String problem = request.getParameter("problem");
		
		final String dateTime = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(Calendar.getInstance().getTime());
		
		final String emailSubject = "Problem in " + app + " reported by " + userName;
		final String emailBody = "User " + userName + " has reported a problem in " + app + " on " + dateTime + "<br><br>" + 
				"Username:&emsp;" + userName + "<br>" + 
				"User Email:&emsp;" + userEmail + "<br>"+ 
				"User Phone:&emsp;" + userPhone + "<br><br>" + 
				"Problem:<br>" + 
				problem + "<br><br>" + 
				"This is an automated email for problem reporting. Please do NOT reply to this email.";  
		
		Thread sendEmailThread = new Thread()
		{
			public void run()
			{
				try
				{
					InitialContext initialContext = new InitialContext();
					Context environmentContext = (Context) initialContext.lookup("java:/comp/env");
					
					//This is how it looked like. Now its in context.xml
					//String fromAddress = "rppdevteam@gmail.com";
					//String emailPassword = "Site4004!";
					//String toAddresses = "rppdevteam@gmail.com," + userEmail;
					
					String fromAddress = (String) environmentContext.lookup(app + ".reportProblem.fromAddress");
					String emailPassword = (String) environmentContext.lookup(app + ".reportProblem.emailPassword");
					String toAddresses = (String) environmentContext.lookup(app + ".reportProblem.toAddresses") + "," + userEmail;
					UseFulMethods.sendEmail(fromAddress, "",emailPassword, toAddresses, emailSubject, emailBody);
					Logger.log(app, "Sending email for problem report in " + app);
				}
				catch (Exception e)
				{
					Logger.log(app, e);
					e.printStackTrace();
				}
			}
		};
		sendEmailThread.start();
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String debug = request.getParameter("debug");
		if (debug != null)
		{
			doPost(request, response);
		}
	}
}
