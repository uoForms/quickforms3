/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.chaps;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import quickforms.controller.Database;
import quickforms.entity.LookupPair;
import quickforms.sme.UseFulMethods;

/**
 *
 * @author Priyanka Jain
 */
public class Chaps_Framingham_Rules
{
	
	public HashMap<String, String[]> ageRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("age"))
		{
			Double betaValue= Double.valueOf(lookupBetasRS.get("age"));
			Double sigmXY=getBetaMultiplyInput(newContext.get("age")[0],betaValue);
			newContext.put("age_calculation", new String[]{String.valueOf(sigmXY)});
			Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0])+sigmXY;
			newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			newContext.remove("age");
		}	
		return newContext;
	} 
	
	
	public HashMap<String, String[]> hdl_cholesterolRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("hdl_cholesterol"))
		{
			Double betaValue= Double.valueOf(lookupBetasRS.get("hdl_cholesterol"));
			Double sigmXY=getBetaMultiplyInput(newContext.get("hdl_cholesterol")[0],betaValue);
			newContext.put("hdl_cholesterol_calculation", new String[]{String.valueOf(sigmXY)});
			Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0])+sigmXY;
			newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			newContext.remove("hdl_cholesterol");
		}
		return newContext;
	} 
	
	
	public HashMap<String, String[]> total_cholesterolRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("total_cholesterol"))
		{
			Double betaValue= Double.valueOf(lookupBetasRS.get("total_cholesterol"));
			Double sigmXY=getBetaMultiplyInput(newContext.get("total_cholesterol")[0],betaValue);
			newContext.put("total_cholesterol_calculation", new String[]{String.valueOf(sigmXY)});
			Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0])+sigmXY;
			newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			newContext.remove("total_cholesterol");
		}
		return newContext;
	} 
	
	public HashMap<String, String[]> systolic_BPRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("systolic_BP"))
		{
			//S_BP beta value based on question 5 and 6
			String Q_five=newContext.get("bp_isHigh")[0];
			String Q_fiveA=newContext.get("prescribed_medication_HBP")[0];
			String Q_Six=newContext.get("taken_HBP_pills")[0];
			Double betaValue;
			if((Q_five.toLowerCase().equals("yes")&&Q_fiveA.toLowerCase().equals("yes"))||Q_Six.toLowerCase().equals("yes"))
			{
				betaValue= Double.valueOf(lookupBetasRS.get("systolic_BP_YES"));
				newContext.put("systolic_BP_YES_NO", new String[]{"yes"});
			}
			else
			{
				betaValue= Double.valueOf(lookupBetasRS.get("systolic_BP_NO"));
				newContext.put("systolic_BP_YES_NO", new String[]{"no"});
			}
			Double sigmXY=getBetaMultiplyInput(newContext.get("systolic_BP")[0],betaValue);
			newContext.put("systolic_BP_calculation", new String[]{String.valueOf(sigmXY)});
			Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0]);
			sum_of_calculation=sum_of_calculation+sigmXY;
			newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			newContext.remove("systolic_BP");
			newContext.remove("bp_isHigh");
			newContext.remove("prescribed_medication_HBP");
			newContext.remove("taken_HBP_pills");
		}
		return newContext;
	} 
	
	public HashMap<String, String[]> diabetesRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("diabetes"))
		{
			String diabetes=newContext.get("diabetes")[0];
			if(diabetes.toLowerCase().equals("yes"))
			{
				Double betaValue= Double.valueOf(lookupBetasRS.get("diabetes"));
				Double sigmXY=1*betaValue;
				newContext.put("diabetes_calculation", new String[]{String.valueOf(sigmXY)});
				Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0])+sigmXY;
				newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			} 
			newContext.remove("diabetes");
		}
		return newContext;
	}
	
	public HashMap<String, String[]> smokingRule(HashMap<String, String[]> newContext,Map<String,String> lookupBetasRS)
	{
		if(newContext.containsKey("smoking"))
		{
			String smoking=newContext.get("smoking")[0];
			if(smoking.toLowerCase().equals("yes"))
			{
				Double betaValue= Double.valueOf(lookupBetasRS.get("smoking"));
				Double sigmXY=1*betaValue;
				newContext.put("smoking_calculation", new String[]{String.valueOf(sigmXY)});
				Double sum_of_calculation= Double.valueOf(newContext.get("sum_of_calculation")[0])+sigmXY;
				newContext.put("sum_of_calculation", new String[]{String.valueOf(sum_of_calculation)});
			
			} 
			newContext.remove("smoking");
		}
		return newContext;
	}
	
	public HashMap<String, String[]> ten_years_riskRule(HashMap<String, String[]> newContext,Database db) 
			throws Exception
	{
		
		String sum_of_calculation=newContext.get("sum_of_calculation")[0];
		String gendar=newContext.get("gendar")[0];
		Map<String,String> ten_years_riskRS;
		Double framingham_score;
		if(gendar.toLowerCase().equals("female"))
		{
			ten_years_riskRS=get_TenYearsRisk_Chart(newContext,db,"tenYearRiskFemale");
			framingham_score=getFraminghamScoreFemale(sum_of_calculation);
			
		}
		else
		{
			ten_years_riskRS=get_TenYearsRisk_Chart(newContext,db,"tenYearRiskMale");
			framingham_score=getFraminghamScoreMale(sum_of_calculation);
		}
		String framingham_scoreStr=String.valueOf(framingham_score);
		newContext.put("framingham_score", new String[]{framingham_scoreStr});
		Set<String> keyset1 = ten_years_riskRS.keySet();
		
		for (String fieldName : keyset1)
		{
				String value =fieldName.replaceAll("X", framingham_scoreStr);
				ScriptEngineManager mgr = new ScriptEngineManager();
				ScriptEngine engine = mgr.getEngineByName("JavaScript");
				Object obj=engine.eval(value);
				if((Boolean)(obj))
				{
					String ten_years_risk=ten_years_riskRS.get(fieldName);
					newContext.put("ten_years_risk", new String[]{ten_years_risk});
					return newContext;
				}
		}
		return newContext;
	}
	
	public Double getFraminghamScoreFemale(String sigmaBetaInput)
	{		
		Double valueD=Double.parseDouble(sigmaBetaInput);
		Double exponentValue=(valueD-26.1931);
		Double exponentResult=Math.exp(exponentValue);
		Double powervalue=Math.pow(0.95012,exponentResult);
        Double calculationResult=(1-powervalue)*100;
		return calculationResult;
	}
	
	public Double getFraminghamScoreMale(String sigmaBetaInput)
	{		
		Double valueD=Double.parseDouble(sigmaBetaInput);
		Double exponentValue=(valueD-23.9802);
		Double exponentResult=Math.exp(exponentValue);
		Double powervalue=Math.pow(0.88936,exponentResult);
        Double calculationResult=(1-powervalue)*100;
		return calculationResult;
	}
	public Map<String,String> get_TenYearsRisk_Chart(HashMap<String, String[]> newContext, Database db,String queryLabel) 
			throws Exception
	{
		String app=newContext.get("app")[0];
		List<LookupPair> ten_years_risklist =null;
		ten_years_risklist =db.getLookupData(app,queryLabel);
		Map<String,String> ten_years_riskRS = UseFulMethods.createLookUP(ten_years_risklist);
		return ten_years_riskRS;
	}
	
	public  Double getBetaMultiplyInput(String value, Double BetaValue)
	{
		Double valueD=Double.parseDouble(value);
		Double log_value=Math.log(valueD);
		Double sigmaXY=log_value*BetaValue;
		return sigmaXY;
	}
	public Map<String,String> getBetaValues(HashMap<String, String[]> context, Database db) 
			throws Exception
	{
		String gendar=context.get("gendar")[0];
		String app=context.get("app")[0];
		List<LookupPair> lookupBetaslist =null;
		if(gendar.toLowerCase().equals("female"))
			lookupBetaslist =db.getLookupData(app,"betaValueFemale");
		else
		    lookupBetaslist =db.getLookupData(app,"betaValueMale");
		Map<String,String> lookupBetasRS = UseFulMethods.createLookUP(lookupBetaslist);
		return lookupBetasRS;
	}
}

