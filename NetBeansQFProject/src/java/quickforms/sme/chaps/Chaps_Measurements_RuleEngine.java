/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.chaps;

import java.util.HashMap;
import java.util.Map;
import quickforms.controller.Database;
import quickforms.controller.PutFact;

/**
 *
 * @author Priyanka Jain
 */
public class Chaps_Measurements_RuleEngine
{
	public void process(HashMap<String, String[]> context, Database db,String factID, String oldContextStr) 
			throws Exception
	{
		if (!(context.containsKey("flag")))
		{
			Chaps_Framingham_Rules rules=new Chaps_Framingham_Rules();
			Map<String,String> lookupBetasRS=rules.getBetaValues(context,db);
			HashMap<String, String[]> insertFact = new HashMap<String, String[]>(context);
			insertFact.put("factTable", new String[]{"framingham"});
			insertFact.put("sum_of_calculation", new String[]{"0.0"});
			insertFact.put("measurementsRefID", new String[]{factID});
			insertFact.put("flag", new String[]{"false"});
			insertFact= rules.ageRule(insertFact,lookupBetasRS);
			insertFact= rules.hdl_cholesterolRule(insertFact,lookupBetasRS);
			insertFact= rules.total_cholesterolRule(insertFact,lookupBetasRS);
			insertFact= rules.systolic_BPRule(insertFact,lookupBetasRS);
			insertFact= rules.diabetesRule(insertFact,lookupBetasRS);
			insertFact= rules.smokingRule(insertFact,lookupBetasRS);
			insertFact= rules.ten_years_riskRule(insertFact,db);
			PutFact.putFactProcess(insertFact, db);
		}
	}
}
