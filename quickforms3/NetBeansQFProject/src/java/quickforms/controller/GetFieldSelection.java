/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashSet;
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
@WebServlet(name = "GetFieldSelection", urlPatterns = {"/getFieldSelection"})
public class GetFieldSelection extends HttpServlet {


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
        String factTable = request.getParameter("factTable");
        String field = request.getParameter("field"); 
        String updateId = request.getParameter("updateid"); 
        String callback = request.getParameter("callback"); 
        boolean measure = false;
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
            List<LookupPair> lookup = db.getLookupData(application,field);
            HashSet<String> updateRows = new HashSet<String>();
            boolean hasUpdateId = updateId != null &&!updateId.equals("null") && !updateId.equals("");
            if(hasUpdateId ){
                if(!field.contains("Multi"))
                {
                    List<List<LookupPair>> row = db.getFactRowMap(application,factTable, updateId);
                    List<LookupPair> updateRow = row.get(0);
                    for(LookupPair col : updateRow)
                    {  
                        if(col.left.equals(field))
                            updateRows.add(col.right);
                    }
                    Logger.log(application,"updateRow: "+updateRow.toString());
                }
                else
                {
                    List<LookupPair> pairs = db.getMultiByKey(application, factTable, field, updateId);
                    for(LookupPair pair : pairs)
                    {
                        updateRows.add(pair.right);
                    }
                }
            }
            int i=0;
            StringBuilder jsonField = new StringBuilder("[");
            for(LookupPair id : lookup)
            {
                String selected = "";
                if(!hasUpdateId ){
                    if(i==0 && !id.right2.contains("-1")){
                        selected = "selected";
                    }
                    else if(id.right2.contains("-1"))
                    {
                        i--;
                    }
                }
                else
                {
                    if((!measure && updateRows.contains(id.left)) || (measure && updateRows.contains(id.right)))
                    {
                        selected = "selected";
                    }
                }
                jsonField.append("{");
                jsonField.append("\"id\":\"").append(id.left).append("\",");
                jsonField.append("\"selected\":\"").append(selected).append("\",");
                jsonField.append("\"label\":\"").append(id.right).append("\",");
                jsonField.append("\"order\":\"").append(id.right2).append("\"");
                jsonField.append("},");
                //out.println("<option  value= "+id+" "+selected+">"+lookup.get(id) +"</option>");
                i++;
            }
            jsonField.setCharAt(jsonField.length()-1, ']');
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
