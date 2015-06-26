/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.naming.InitialContext;
import javax.servlet.ServletException; 
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import quickforms.dao.Database;
import quickforms.dao.Logger;
import quickforms.dao.LookupPair;

/**
 *
 * @author achamney
 */
@WebServlet(name = "UpdateLookup", urlPatterns = {"/updateLookup"})
public class UpdateLookup extends HttpServlet {

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
       Map<String,String[]> inParams = request.getParameterMap();
       Map<String,String[]> params = new HashMap<String,String[]>(inParams);//inParams is read only
       System.out.println("Updating Lookup");
       response.setContentType("text/html;charset=UTF-8");
       String application = request.getParameter("app");
       String lookup = request.getParameter("lookup");
       String values= request.getParameter("values");
       System.out.println(values);
       Database db = null;
       String json = null;
       PrintWriter out = response.getWriter();
        try{
            InitialContext cxt = new InitialContext(); 
            DataSource  ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"+application);
            db = new Database(ds);
            
            db.updateLookup(application,lookup,jsonToHashMap(values),new ArrayList<LookupPair>());
            
        }
        catch(Exception e)
        {
            Logger.log(application, e);
            out.append(e.toString());
            db.disconnect();
        }
       
       out.close();
    }
    @Override
    protected void doGet (HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
        String debug = request.getParameter("debug");
        if(debug != null)
        {
            doPost(request,response);
        }
    }

    private HashMap<String,HashMap<String,String>> jsonToHashMap(String values) throws Exception {
        HashMap<String,HashMap<String,String>> lookups = new HashMap<String,HashMap<String,String>>();
        JSONParser parser = new JSONParser();
        JSONArray wrapper;
 
        wrapper = (JSONArray) parser.parse(values);
        int curNewId = -1;
        for(int i=0;i<wrapper.size();i++)
        {
            JSONObject jObj = (JSONObject) wrapper.get(i);
            HashMap<String,String> thisRow = new HashMap<String, String>();
            String rowKey = "";
            for(Object key : jObj.keySet())
            {
                
                if(((String)key).contains("Key"))
                {
                    rowKey = (String)jObj.get(key);
                    if(rowKey.isEmpty())
                        rowKey = Integer.toString(curNewId--); // identify this row as an insert
                    thisRow.put((String)key, rowKey);
                }
                else
                {
                    Object curCell = jObj.get(key);
                    if(isNumber(curCell))
                    {
                        
                        curCell = ""+((Number)curCell).doubleValue();
                    }
                    thisRow.put((String)key, (String) curCell);
                }
            }
            lookups.put(rowKey,thisRow);
        }
        
        return lookups;
    }
    public boolean isNumber(Object num)
    {
        try{
            String test = (String)num;
            return false;
        }
        catch(Exception e){return true;}
    }
    public static void main(String[] arg)
    {
        
        try{
            new UpdateLookup().jsonToHashMap("[{\"1\":2}]");
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
    }
}
