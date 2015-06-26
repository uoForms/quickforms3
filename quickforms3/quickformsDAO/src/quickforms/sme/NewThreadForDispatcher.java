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
 * @author Priyanka Jain
 */
public class NewThreadForDispatcher implements Runnable
{
	
	Map<String, String[]> context;
	Database db;
	DataSource ds;
	String factID;
	List<List<LookupPair>> oldContext;
	
	public NewThreadForDispatcher(Map<String, String[]> params, DataSource ds, String factID, List<List<LookupPair>> oldContext) throws Exception
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
			// Dispatcher to Priyanka's Rule Engine
			DispatcherToRuleEngine d = new DispatcherToRuleEngine();
			
			// d.dispatchToRuleEngine(request, response,rowId, ds,oldRecord);
			d.dispatchToRuleEngine(context, ds, factID, oldContext);
			
		}
		catch (Exception ex)
		{
			Logger.log(application, ex);
			ex.printStackTrace();
		}
	}
}
