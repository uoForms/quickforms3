package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.naming.InitialContext;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import quickforms.dao.Database;
import quickforms.dao.Logger;

/**
 * Servlet implementation class PutPregappNotification
 */
@WebServlet(name = "PutPregappNotification", urlPatterns = { "/putPregappNotification" })
public class PutPregappNotification extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PutPregappNotification() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String debug = request.getParameter("debug");
		if (debug != null)
		{
			doPost(request, response);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map<String, String[]> inParams = request.getParameterMap();
		Map<String, String[]> params = new HashMap<String, String[]>(inParams); // inParams is read only
		
		System.out.println("Starting pregapp email notifications");
		response.setContentType("text/html;charset=UTF-8");
		
		String application = request.getParameter("app");
		
		Database db = null;
		String json = null;
		PrintWriter out = response.getWriter();
		
		try
		{
			InitialContext cxt = new InitialContext();
			DataSource ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/" + application);
			db = new Database(ds);
			json = db.sendPregAppNotifications(params, db);
			out.print(json);			
		}
		catch (Exception e)
		{
			Logger.log(application, e);
			out.append(e.toString());
			db.disconnect();
			e.printStackTrace();
		}
		
		out.close();
	}

}
