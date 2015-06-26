/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource; 
import quickforms.dao.Database;
import quickforms.dao.Logger;
import quickforms.dao.LookupPair;

/**
 *
 * @author achamney
 */
@WebServlet(name = "GetMultiData", urlPatterns = {"/getMultiData"})
public class GetMultiData extends HttpServlet {

    public static ArrayList<LookupPair> getFilterList(String lookupParam) {
        ArrayList<LookupPair> lookupList =  new ArrayList<LookupPair>();
        if(lookupParam != null)
        {
            String[] lookupTuples = lookupParam.split(",");
            for(int i=0;i<lookupTuples.length;i++)
            {
                String[] lookupLeftRight = lookupTuples[i].split("=");
                if(lookupLeftRight.length>1){
                    lookupList.add(new LookupPair(lookupLeftRight[0],lookupLeftRight[1]));
                }
                else
                {
                    lookupList.add(new LookupPair(lookupLeftRight[0],""));
                }
            }
        }
        return lookupList;
    }


    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String application = request.getParameter("app");
        String factTable = request.getParameter("fact");
        String field = request.getParameter("field");
        String lookupParam = request.getParameter("lookup"); 
        String updateId = request.getParameter("updateid");  
        String callback = request.getParameter("callback");  
        Database db = null;
        try{
            InitialContext cxt = new InitialContext(); 
            DataSource  ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"+application);
            db = new Database(ds);
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        response.setContentType("text/html;charset=UTF-8");
       
        PrintWriter out = response.getWriter();
        try{
            List<LookupPair> paramList = getFilterList(lookupParam);
            List<List<LookupPair>> lookup = db.getMultiData(application,field, paramList);
            boolean hasUpdateId = updateId != null &&!updateId.equals("null") && !updateId.equals("");

            int i=0;
            StringBuilder jsonField = new StringBuilder("[");
            List<LookupPair> multiValues = null;
            if(hasUpdateId){
                multiValues = db.getMultiByKey(application, factTable, field, updateId);}
            for(List<LookupPair> id : lookup)
            {
                String selected = "";
                jsonField.append("{");
                String rowId = "";
                for(int j=0;j<id.size();j++)
                {
                    jsonField.append("\"").append(id.get(j).left).append("\":\"").append(id.get(j).right).append("\",");
                    if(id.get(j).left.contains("Key"))
                    {
                        rowId = id.get(j).right;
                    }
                }
                if(hasUpdateId )
                {
                   for(LookupPair pair : multiValues)
                   {
                       if(pair.right.equals(rowId))
                       {
                           selected = "selected";
                       }
                   }
                }
                
                jsonField.append("\"selected\":\"").append(selected).append("\"");
                jsonField.append("},");
                //out.println("<option  value= "+id+" "+selected+">"+lookup.get(id) +"</option>");
                i++;
            }
            jsonField.deleteCharAt(jsonField.length()-1);
            jsonField.append("]");
            if(lookup.isEmpty()){
                jsonField = new StringBuilder("{}");}
            String returnJson = jsonField.toString();
            if(callback != null)
            {
                returnJson = returnJson.replace("'", "\\'");
                returnJson = returnJson.replace("\\\\'", "\\'");
                returnJson = returnJson.replace("\\\"", "\\\\\"");
                returnJson = callback+"('"+returnJson+"')";
            }
            out.append(returnJson); 
        }
        catch(Exception e)
        {
            Logger.log(application,e);
            out.append(e.toString());
            for(StackTraceElement el : e.getStackTrace())
            {
                out.append(el.toString());
            }
            
            db.disconnect();
        }
        out.close();
    }

}
