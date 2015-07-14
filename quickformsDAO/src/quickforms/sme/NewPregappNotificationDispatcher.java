/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.Database;
import quickforms.dao.Logger;
import quickforms.dao.LookupPair;

/**
 *
 * @author Ben Eze
 */
public class NewPregappNotificationDispatcher implements Runnable
{
	
	Map<String, String[]> context;
	Database db;
	DataSource ds;
	String factID;
	List<List<LookupPair>> oldContext;
	
	public NewPregappNotificationDispatcher(Map<String, String[]> params, DataSource ds, String factID, List<List<LookupPair>> oldContext) throws Exception
	{
		this.context = params;
		this.db = new Database(ds);
		this.ds = ds;
		this.factID = factID;
		if (oldContext != null)
			this.oldContext = oldContext;
	}
	
	@Override
	public void run()
	{
		String application = context.get("app")[0];
		
		try
		{				
			String stateHandler = "quickforms.sme.pregapp.Pregapp_EmailNotification_RuleEngine";
			Class<?> theClass = Class.forName(stateHandler); // reflection
			Object appRulesClassObj = theClass.newInstance();
			
			if (appRulesClassObj instanceof RuleEngine)
			{
				RuleEngine appEngine = (RuleEngine) appRulesClassObj;
				appEngine.process(context, ds, null, null);
			}			
		}
		catch (Exception ex)
		{
			Logger.log(application, ex);
			ex.printStackTrace();
		}
	}
}
