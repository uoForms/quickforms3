/*  Copyright (c) 2015 Katherine ChengLi, katchengli@gmail.com
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import javax.management.MBeanServer;
import javax.management.MBeanServerFactory;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import quickforms.dao.Database;
import quickforms.dao.Logger;

/**
 * Servlet implementation class GetQuickformsAppsStartupInfo
 * 
 * Used to get information about the Quickforms Apps on the server
 * 
 * @author katchengli
 */
@WebServlet(name = "GetQuickformsAppsStartupInfo", urlPatterns = { "/getQuickformsAppsStartupInfo" })
public class GetQuickformsAppsStartupInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetQuickformsAppsStartupInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * 
	 *      Writes a JSON structure describing the Quickforms Apps on the server
	 */

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		PrintWriter out = response.getWriter();
		try {
			JSONArray appsJSON = createJSONStructure();
			out.write(appsJSON.toJSONString());
		} catch (Exception e) {
			Logger.log("quickforms", e);
			e.printStackTrace();
		}
		out.close();
	}

	/**
	 * 
	 * @return A {@code JSONArray} describing the Quickforms Apps
	 */
	@SuppressWarnings("unchecked")
	private JSONArray createJSONStructure() {
		HashMap<String, Boolean> appConnections = getAppConnections();

		JSONArray appsJSON = new JSONArray();
		Iterable<String> apps = collectAllDeployedApps();

		for (String app : apps) {
			// Ignoring default Tomcat apps and quickforms itelf
			if (!app.equals("manager") && !app.equals("docs")
					&& !app.equals("quickforms") && !app.equals("localhost")
					&& !app.isEmpty()) {
				String description = getAppDescription(app);
				String defaultUser = getAppDefaultUser(app);
				JSONObject appJSON = new JSONObject();
				appJSON.put("name", app);
				if (appConnections.containsKey(app)) {
					if(appConnections.get(app)){
						appJSON.put("connected", true);
					}else{
						appJSON.put("connected", false);
					}
				} else {
					appJSON.put("connected", false);
				}
				appJSON.put("description", description);
				appJSON.put("defaultUser", defaultUser);
				appsJSON.add(appJSON);
			}
		}

		return appsJSON;
	}

	/**
	 * 
	 * @return An {@code Iterable<String>} of all the Apps on the Apache Tomcat
	 *         server (including the default apps)
	 */
	private Iterable<String> collectAllDeployedApps() {
		try {
			final Set<String> result = new HashSet<>();
			final Set<ObjectName> instances = findServer().queryNames(
					new ObjectName("Catalina:j2eeType=WebModule,*"), null);
			for (ObjectName each : instances) {
				result.add(substringAfterLast(each.getKeyProperty("name"), "/"));
			}
			return result;
		} catch (MalformedObjectNameException e) {
			// handle
		}
		return null;
	}

	/**
	 * A utility function that returns the last string after a separator
	 * 
	 * @param x
	 * @param separator
	 * @return A {@code String} of the last string instance after a separator
	 */
	private String substringAfterLast(String x, String separator) {
		String[] substrings = x.split(separator);

		return substrings[substrings.length - 1];
	}

	/**
	 * A utility function that finds the Apache Tomcat (Catalina) server
	 * 
	 * @return an instance of {@code MBeanServer}
	 */
	private MBeanServer findServer() {
		ArrayList<MBeanServer> servers = MBeanServerFactory
				.findMBeanServer(null);
		for (MBeanServer eachServer : servers) {
			for (String domain : eachServer.getDomains()) {
				if (domain.equals("Catalina")) {
					return eachServer;
				}
			}
		}
		// handle. We are not in Tomcat.
		return null;
	}

	/**
	 * A function that returns all apps that should have a database with their
	 * connection state
	 * 
	 * @return A {@code HashMap<String>} containing the app name as key and a
	 *         boolean indicating the connection state ({@code true} for a
	 *         successful connection and {@code false} otherwise)
	 */
	private HashMap<String, Boolean> getAppConnections() {
		HashMap<String, Boolean> appConnections = new HashMap<String, Boolean>();

		Database db = null;
		try {
			InitialContext cxt = new InitialContext();
			NamingEnumeration<NameClassPair> ne = cxt
					.list("java:/comp/env/jdbc");

			while (ne.hasMore()) {
				NameClassPair nc = (NameClassPair) ne.next();
				String connectionName = nc.getName();

				DataSource ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"
						+ connectionName);
				db = new Database(ds);
				try {
					db.testConnection();
					appConnections.put(connectionName, true);
				} catch (Exception e) {
					appConnections.put(connectionName, false);
				}
			}
		} catch (Exception e) {
			Logger.log("serverstartup", e);
			e.printStackTrace();
			db.disconnect();
		}

		return appConnections;
	}

	/**
	 * A function that the Quickforms' App description
	 * 
	 * @param A {@code String} containing the app name 
	 * @return A {@code String} containing the app description
	 */
	private String getAppDescription(String appName) {
		String appDescription = "";
		String tempDescription = null;

		try {
			InitialContext initialContext = new InitialContext();
			Context environmentContext = (Context) initialContext
					.lookup("java:/comp/env");
			tempDescription = (String) environmentContext.lookup(appName
					+ ".description");

		} catch (NamingException e) {
			Logger.log("serverstartup", e);
			e.printStackTrace();
		}

		// We want an empty string if there is no description, and not null
		if (tempDescription != null)
			appDescription = tempDescription;

		return appDescription;
	}
	
	/**
	 * A function that the Quickforms' App description
	 * 
	 * @param A {@code String} containing the app name 
	 * @return A {@code String} containing the app default user information
	 */
	private String getAppDefaultUser(String appName) {
		String appDefaultUser = "";
		String tempDefaultUser = null;

		try {
			InitialContext initialContext = new InitialContext();
			Context environmentContext = (Context) initialContext
					.lookup("java:/comp/env");
			tempDefaultUser = (String) environmentContext.lookup(appName
					+ ".defaultUser");

		} catch (NamingException e) {
			Logger.log("serverstartup", e);
			e.printStackTrace();
		}

		// We want an empty string if there is no description, and not null
		if (tempDefaultUser != null)
			appDefaultUser = tempDefaultUser;

		return appDefaultUser;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
