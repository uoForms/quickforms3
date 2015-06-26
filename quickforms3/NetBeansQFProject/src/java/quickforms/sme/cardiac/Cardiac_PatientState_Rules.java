/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.cardiac;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author Priyanka Jain
 */
public class Cardiac_PatientState_Rules

{
	public List<HashMap> TRIAGEDState_Rule(HashMap<String, String[]> context,String[] currState,String factID) 
			throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
		
		
	}
	public List<HashMap>  ORDER_CONSULTATIONState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
		
	}
	public List<HashMap>  IN_CONSULTATIONState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		/*1=test
		2=admit
		3=discharge	*/
		String InConsultNextState=currState[0]+context.get("consultSteps")[0];
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(InConsultNextState));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
				
		
	}
	public List<HashMap> ORDER_ADMITState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
	}
	public List<HashMap> ORDER_TESTState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
	}
	public List<HashMap> ORDER_DISCHARGEState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
	}
	public List<HashMap> ORDER_TRANSPORT_ADMITState_Rule(HashMap<String, String[]> context,String[] currState,String factID)
	throws Exception
	{
		Integer nextStateKey=Cardiac_PatientState_Constants.getNextState(Integer.valueOf(currState[0]));
		Integer nextStateProvider=Cardiac_PatientState_Constants.getProvider(Integer.valueOf(currState[0]));
		List<HashMap> facts=new ArrayList();
		facts.add(updateOldFact(context,factID));
		facts.add(createNewFact(context,String.valueOf(nextStateKey),String.valueOf(nextStateProvider)));
		return facts;
	}
	
	
	public HashMap<String, String[]> updateOldFact(HashMap<String, String[]> context,String factID) throws Exception
	{
		HashMap<String, String[]> oldContext = new HashMap<String, String[]>(context);
		oldContext.put("Assigned", new String[]{"false"});
		/*if(context.containsKey("createdDate"))
		      oldContext.put("startTimestamp", new String[]{context.get("createdDate")[0]});*/
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		String curDate = formatter.format(System.currentTimeMillis());
		oldContext.put("endTimestamp", new String[]{curDate});
		if(factID != null)
			oldContext.put("updateid", new String[]{factID});
		
		oldContext.remove("updatedDate");
		oldContext.remove("createdDate");
		oldContext.remove("room");
		oldContext.remove("patient");
		oldContext.remove("state");
		
		return oldContext;
	}
	public HashMap<String, String[]> createNewFact(HashMap<String, String[]> context,String newState,String provider) throws Exception
	{
		HashMap<String, String[]> newContext = new HashMap<String, String[]>(context);
		newContext.put("state", new String[]{newState});
		newContext.put("Assigned", new String[]{"false"});
		
		if(newContext.containsKey("updateid"))
			newContext.remove("updateid");
		newContext.put("provider", new String[]{provider});
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String curDate = formatter.format(System.currentTimeMillis());
		if(newState.equals(String.valueOf(Cardiac_PatientState_Constants.STATE_DISCHARGED)))
			newContext.put("endTimestamp", new String[]{curDate});
		newContext.remove("createdDate");
		newContext.remove("updatedDate");
		return newContext;
	}
}
