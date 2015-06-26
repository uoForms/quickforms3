/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package quickforms.sme.cardiac;
/**
 *
 * @author Priyanka Jain
 */
public abstract class Cardiac_PatientState_Constants
{
	
	//provider state constant
	public static final int STATE_TRIAGED = 1;
	public static final int STATE_ORDER_CONSULTATION = 2;
	public static final int STATE_IN_CONSULTATION = 3;
	public static final int STATE_ORDER_ADMIT = 4;
	public static final int STATE_ORDER_TEST = 5;
	public static final int STATE_ORDER_DISCHARGE = 6;
	public static final int STATE_ORDER_TRANSPORT_ADMIT = 7;
	public static final int STATE_DISCHARGED= 8;
	public static final int STATE_IN_BED = 9;
	public static final int STATE_IN_CONSULTATION_TEST = 31;
	public static final int STATE_IN_CONSULTATION_ADMIT = 32;
	public static final int STATE_IN_CONSULTATION_DISCHARGE = 33;
	//provider constant
	public static final int PROVIDER_PHYSICIAN = 2;
	public static final int PROVIDER_NURSE = 3;
	public static final int PROVIDER_TRANSPORTER = 4;
	
	static public Integer getNextState(Integer currStateKey)
	{
		Integer nextStateKey=null;
		switch(currStateKey)
		{
			case STATE_TRIAGED:  nextStateKey=STATE_ORDER_CONSULTATION;
				      break;
			case STATE_ORDER_CONSULTATION:  nextStateKey=STATE_IN_CONSULTATION;
				      break;
			//in_cunsultation state haas to decide later here
			case STATE_IN_CONSULTATION_TEST:nextStateKey=STATE_ORDER_TEST;
				      break;	
				
			case STATE_IN_CONSULTATION_ADMIT :nextStateKey=STATE_ORDER_ADMIT;
				      break;
				
			case STATE_IN_CONSULTATION_DISCHARGE :nextStateKey=STATE_ORDER_DISCHARGE;
				      break;	
				
		    case STATE_ORDER_TEST:  nextStateKey=STATE_ORDER_CONSULTATION;
				      break;	
			case STATE_ORDER_ADMIT:  nextStateKey=STATE_ORDER_TRANSPORT_ADMIT;
				      break;	
			case STATE_ORDER_TRANSPORT_ADMIT:  nextStateKey=STATE_IN_BED;
				      break;	
			case STATE_ORDER_DISCHARGE:  nextStateKey=STATE_DISCHARGED;
				      break;
		}
		return 	nextStateKey;
		
	} 
	
	static public Integer getProvider(Integer currStateKey)
	{
		Integer nextStateProvider=null;
		switch(currStateKey)
		{
			
			case STATE_TRIAGED: 
			case STATE_ORDER_CONSULTATION:
			case STATE_ORDER_TEST:
				    nextStateProvider=PROVIDER_PHYSICIAN;
				    break;
				
			case STATE_IN_CONSULTATION:	
			case STATE_ORDER_DISCHARGE: 
					nextStateProvider=PROVIDER_NURSE;
				    break;
				
			case STATE_ORDER_ADMIT:
			case STATE_ORDER_TRANSPORT_ADMIT:
					nextStateProvider=PROVIDER_TRANSPORTER;
				      break;	
		}
		return 	nextStateProvider;
		
	} 
	
}
