/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package quickforms.sme;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.LookupPair;

/**
 *
 * @author Priyanka Jain
 */
public class DispatcherToRuleEngine
{
	public void dispatchToRuleEngine(Map<String, String[]> params, DataSource ds, String factID, List<List<LookupPair>> oldContext) throws Exception
	{
		String appPackage = params.get("app")[0];
		String appRuleEngine = (Character.toString(appPackage.charAt(0)).toUpperCase() + appPackage.substring(1));
		String factTable = params.get("factTable")[0];
		factTable = (Character.toString(factTable.charAt(0)).toUpperCase() + factTable.substring(1));
		String stateHandler = "quickforms.sme." + appPackage + "." + appRuleEngine + "_" + factTable + "_RuleEngine";
		Class<?> theClass = Class.forName(stateHandler); // reflection
		Object appRulesClassObj = theClass.newInstance();
		if (appRulesClassObj instanceof RuleEngine)
		{
			RuleEngine appEngine = (RuleEngine) appRulesClassObj;
			appEngine.process(params, ds, factID, oldContext);
		}
		
	}
	/*
	 * public void dispatchToRuleEngine(Map<String,String[]> params, String
	 * factId, DataSource ds) throws Exception {
	 * 
	 * String appPackage = params.get("app")[0]; String
	 * appRuleEngine=(Character.
	 * toString(appPackage.charAt(0)).toUpperCase()+appPackage.substring(1));
	 * String factTable = params.get("factTable")[0];
	 * factTable=(Character.toString
	 * (factTable.charAt(0)).toUpperCase()+factTable.substring(1)); String
	 * stateHandler="quickforms.sme."+appPackage+"."
	 * +appRuleEngine+"_"+factTable+"_RuleEngine";
	 * 
	 * //String stateHandler="quickforms.sme."+request.getParameter("app")+"";
	 * Class theClass = Class.forName(stateHandler); // reflection AppInterface
	 * FhI = (AppInterface)theClass.newInstance();
	 * FhI.process(params,factId,ds);
	 * 
	 * }
	 */
	
	/*
	 * public void dispatchToRuleEngine(HttpServletRequest
	 * request,HttpServletResponse response, String factId, DataSource ds)
	 * throws Exception {
	 * 
	 * String appPackage=request.getParameter("app"); String
	 * appRuleEngine=(Character
	 * .toString(appPackage.charAt(0)).toUpperCase()+appPackage.substring(1));
	 * String factTable=request.getParameter("factTable");
	 * factTable=(Character.toString
	 * (factTable.charAt(0)).toUpperCase()+factTable.substring(1)); String
	 * stateHandler="quickforms.sme."+appPackage+"."
	 * +appRuleEngine+"_"+factTable+"_RuleEngine";
	 * 
	 * 
	 * //String stateHandler="quickforms.sme."+request.getParameter("app")+"";
	 * Class theClass = Class.forName(stateHandler); // reflection AppInterface
	 * FhI = (AppInterface)theClass.newInstance();
	 * FhI.process(request,response,factId,ds);
	 * 
	 * }
	 */
}
