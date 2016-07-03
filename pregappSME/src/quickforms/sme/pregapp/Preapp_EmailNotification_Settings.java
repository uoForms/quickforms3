package quickforms.sme.pregapp;

import java.io.File;


import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSSerializer;

public class Preapp_EmailNotification_Settings {
	private String defaultSenderEmail="";
	private String defaultSenderAlias="";
	private String defaultSenderPassword="";
	private String adminEmails = "";
	private String subjectTemplate = "";
	private String emailBodyTemplate = "";
	
	
	public String getDefaultSenderEmail(){
		return defaultSenderEmail;
	}
	
	public void setDefaultSenderEmail(String value){
		defaultSenderEmail = value;
	}
	
	public String getDefaultSenderAlias(){
		return defaultSenderAlias;
	}
	
	public void setDefaultSenderAlias(String value){
		defaultSenderAlias = value;
	}
	
	public String getDefaultSenderPassword(){
		return defaultSenderPassword;
	}
	
	public void setDefaultSenderPassword(String value){
		defaultSenderPassword = value;
	}
	
	public String getAdminEmails(){
		return adminEmails;
	}
	
	public void setAdminEmails(String value){
		adminEmails = value;
	}
	
	public String getSubjectTemplate(){
		return subjectTemplate;
	}
	
	public void setSubjectTemplate(String value){
		subjectTemplate = value;
	}
	
	public String getBodyTemplate(){
		return emailBodyTemplate;
	}
	
	public void setBodyTemplate(String value){
		emailBodyTemplate = value;
	}
	
	@SuppressWarnings("unused")
	private String getText(Node node) {
	    StringBuffer result = new StringBuffer();
	    if (! node.hasChildNodes()) return "";

	    NodeList list = node.getChildNodes();
	    for (int i=0; i < list.getLength(); i++) {
	        Node subnode = list.item(i);
	        if (subnode.getNodeType() == Node.TEXT_NODE) {
	            result.append(subnode.getNodeValue());
	        }
	        else if (subnode.getNodeType() == Node.CDATA_SECTION_NODE) {
	            result.append(subnode.getNodeValue());
	        }
	        else if (subnode.getNodeType() == Node.ENTITY_REFERENCE_NODE) {
	            // Recurse into the subtree for text
	            // (and ignore comments)
	            result.append(getText(subnode));
	        }
	    }

	    return result.toString();
	}
	
	public String innerXml(Node node) {
	    DOMImplementationLS lsImpl = (DOMImplementationLS)node.getOwnerDocument().getImplementation().getFeature("LS", "3.0");
	    LSSerializer lsSerializer = lsImpl.createLSSerializer();
	    NodeList childNodes = node.getChildNodes();
	    StringBuilder sb = new StringBuilder();
	    for (int i = 0; i < childNodes.getLength(); i++) {
	       sb.append(lsSerializer.writeToString(childNodes.item(i)));
	    }
	    return sb.toString(); 
	}
	
	public Boolean loadFromFile(){
		
		try{
			
			File inputFile = new File("C:\\TaskScripts\\Settings\\Pregapp.xml");
	         DocumentBuilderFactory dbFactory 
	            = DocumentBuilderFactory.newInstance();
	         
	         DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
	         Document doc = dBuilder.parse(inputFile);
	         doc.getDocumentElement().normalize();
	         System.out.println("Root element :" 
	            + doc.getDocumentElement().getNodeName());
	         NodeList nList = doc.getElementsByTagName("DefaultSenderEmail");
	         
	         if(nList.getLength() > 0){
	        	 NamedNodeMap attributes = nList.item(0).getAttributes();	        	
	        	 this.defaultSenderEmail = attributes.getNamedItem("email").getNodeValue();
	        	 this.defaultSenderAlias = attributes.getNamedItem("alias").getNodeValue();
	        	 this.defaultSenderPassword = attributes.getNamedItem("password").getNodeValue();
	         }
	         
	         
             nList = doc.getElementsByTagName("AdminEmails");
	         
	         if(nList.getLength() > 0){
	        	 NamedNodeMap attributes = nList.item(0).getAttributes();
	        	 this.adminEmails = attributes.getNamedItem("emails").getNodeValue();
	         }
	         
             nList = doc.getElementsByTagName("Subject");
	         
	         if(nList.getLength() > 0){
	        	 NamedNodeMap attributes = nList.item(0).getAttributes();
	        	 this.subjectTemplate = attributes.getNamedItem("title").getNodeValue();
	         }
	         
             nList = doc.getElementsByTagName("Body");
	         
	         if(nList.getLength() > 0){
	        	 this.emailBodyTemplate = innerXml(nList.item(0)).replace("<?xml version=\"1.0\" encoding=\"UTF-16\"?>", "").trim();
	         }	         
	         
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	
	public static void main(String[] args) {
		
		try{
			Preapp_EmailNotification_Settings settings = new Preapp_EmailNotification_Settings();
			
			if(settings.loadFromFile()){
				System.out.println("Default Sender: " + settings.getDefaultSenderEmail() + "<" + settings.getDefaultSenderAlias() + ">");
				System.out.println("Subject: " + settings.getSubjectTemplate());
				System.out.println("Admin emails: " + settings.getAdminEmails());
				System.out.println("Body:" + settings.getBodyTemplate());
			}			
			
		}catch(Exception e){
			e.printStackTrace();
		}	
		
	}
}


