/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.cardiac;

import java.util.HashMap;
import java.util.List;
import quickforms.controller.Database;
import quickforms.entity.LookupPair;
import java.lang.reflect.Method;
import java.util.Map;
import quickforms.controller.PutFact;
import quickforms.sme.UseFulMethods;
/**
 *
 * @author Priyanka Jain
 */
public class Cardiac_PatientState_RuleEngine
{
	public void process(HashMap<String, String[]> context, Database db, String factID, String oldContextStr)
			throws Exception
	{
		if(!(context.containsKey("Assigned")))
		{
			List<HashMap>contextList = process_helper(context, db,factID);
			if(contextList!=null)
			{	
				HashMap<String, String[]> oldFactUpdate=contextList.get(0);
				HashMap<String, String[]> newFactInsert=contextList.get(1);
				PutFact.putFactProcess(oldFactUpdate, db);
				PutFact.putFactProcess(newFactInsert, db);
			}	
		}
    }
	public List<HashMap> process_helper(HashMap<String, String[]> context, Database db,String factID)
	throws Exception
	{
		String methodName;
		List<HashMap>contextList=null;
		String[] currState=readCurrState(context, db,factID);
		if(currState!=null)
		{	
			methodName=currState[1]+"State_Rule";
			Class<?> cls = Class.forName("quickforms.sme.cardiac.Cardiac_PatientState_Rules");
			Object obj = cls.newInstance();
			Method method = cls.getDeclaredMethod(methodName, context.getClass(),currState.getClass(),factID.getClass());
			Object object = method.invoke(obj, context,currState,factID);
			contextList = (List<HashMap>)object;
		}
		return contextList;
	}
	public String[] readCurrState(HashMap<String, String[]> context, Database db,String factID)throws Exception
	{
		String curStateFactStr=db.getFactRow(context.get("app")[0],context.get("factTable")[0],factID);
		List<Map> curStateFactList=UseFulMethods.createRSContext(curStateFactStr);
		Map<String, String[]> curStateFact = curStateFactList.get(0);
		String[] currState=null;
		List<LookupPair> lookup=db.getLookupData(context.get("app")[0], "state");
		for(LookupPair pair : lookup)
        {
		  if(pair.left.equals(curStateFact.get("state")[0]))	
		  {
			currState=new String[2];
			currState[0] = pair.left;	
			currState[1] = pair.right;
			return currState;	
		  } 
		}
		return currState;
	}
}	
