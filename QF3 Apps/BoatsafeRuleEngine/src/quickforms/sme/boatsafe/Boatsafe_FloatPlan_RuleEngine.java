package quickforms.sme.boatsafe;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.Database;
import quickforms.dao.LookupPair;
import quickforms.sme.RuleEngine;
import quickforms.sme.UseFulMethods;

public class Boatsafe_FloatPlan_RuleEngine implements RuleEngine{
	private static final String EMERGENCY_EMAIL = "emergencyContactEmail";
	private static final String EMERGENCY_CONTACT = "emergencyContact";
	private static final String TRAVELLER = "traveller";
	private static final String DEPARTURE_LOCATION = "departureLocation";
	private static final String DEPARTURE_DATE = "departureLocationDate";
	private static final String ARRIVAL_LOCATION = "arrivalLocation";
	private static final String ARRIVAL_DATE = "arrivalDate";
	
	private static final String SENDER_EMAIL = "boatsafeteam@gmail.com";
	private static final String SENDER_PASSWORD = "boatsafeadmin";
	private static final String SENDER_ALIAS = "BoatSafe";
	

	@Override
	public void process(Map<String, String[]> context, DataSource ds, String factID,
			            List<List<LookupPair>> oldContextStr) throws Exception {
		Database db = new Database(ds);
		String emergencyEmail = context.get(EMERGENCY_EMAIL)[0];
		String emergencyName = context.get(EMERGENCY_CONTACT)[0];
		String traveller = context.get(TRAVELLER)[0];
		String departureLocation = context.get(DEPARTURE_LOCATION)[0];
		String departureDate = context.get(DEPARTURE_DATE)[0];
		String arrivalLocation = context.get(ARRIVAL_LOCATION)[0];
		String arrivalDate = context.get(ARRIVAL_DATE)[0];
		if(emergencyEmail!=null){
			String subject = "FloatPlan for "+ traveller;
			String message = "<h3>Dear $contact, </h3>"
					       + "<p>You are receiving the float plan for $traveller. See below for some details: <p>"
					       + "<div><ul><li>Departure location: $departureLocation</li> "
					       + "<li>Depature Date: $departureDate </li>"
					       + "<li>Arrival location: $arrivalLocation </li>"
					       + "<li>Arrival Date: $arrivalDate </li></ul></div>"
					       + "<br><br><br>BoatSafe Team";
			message = message.replace("$contact", emergencyName);
			message = message.replace("$traveller", traveller);
			message = message.replace("$departureLocation", departureLocation);
			message = message.replace("$departureDate", departureDate);
			message = message.replace("$arrivalLocation", arrivalLocation);
			message = message.replace("$arrivalDate", arrivalDate);
			
			UseFulMethods.sendEmail(SENDER_EMAIL, SENDER_ALIAS, SENDER_PASSWORD, emergencyEmail, subject, message);	
			
			Map<String, String[]> newContext = createNewContext(context.get("app")[0], "emailSent", factID, message,
					                                            SENDER_EMAIL, emergencyEmail);
			db.putFactProcess(newContext, db);
		}

		
	}
	
	private Map<String, String[]> createNewContext(String app, String factTable, String factID, String message, 
			                      String senderEmail, String receiverEmail){
		Map<String, String[]> context = new HashMap<>();
		context.put("app", new String[]{app});
		context.put("factTable", new String[]{factTable});
		context.put("userkey", new String[]{factID});
		context.put("message", new String[]{message});
		context.put("senderEmail", new String[]{senderEmail});
		context.put("receiverEmail", new String[]{receiverEmail});
		return context;
	}
}
