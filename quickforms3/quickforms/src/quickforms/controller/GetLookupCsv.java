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
@WebServlet(name = "GetLookupCsv", urlPatterns = {"/getLookupCsv"})
public class GetLookupCsv extends HttpServlet {

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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException , IOException
    {
       String application = request.getParameter("app");
       String field = request.getParameter("field");
       String filter = request.getParameter("filter");
       PrintWriter out = response.getWriter();
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
       try
       {
          ArrayList<LookupPair> filterList = GetMultiData.getFilterList(filter); 
          StringBuilder csvBuilder = createCsv(db,application,field,filterList);
          response.setContentType("application/octet-stream");
          response.setContentLength(csvBuilder.length());
          response.setHeader("Content-Disposition", "attachment; filename=\"" + field + ".csv\"");
          out.append(csvBuilder.toString());
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
           out.close();
       }
       out.close();
    }
    public static StringBuilder createCsv(Database db,String application,String field,ArrayList<LookupPair> filter) throws Exception
    {
        List<List<LookupPair>> lookup= db.getMultiData(application, field,filter);
        StringBuilder csvBuilder = new StringBuilder();
        for(LookupPair col : lookup.get(0))
        {
            if(col.left.contains("Order"))
            {
                continue;
            }
            csvBuilder.append(col.left).append(',');
        }
        csvBuilder.append("\r\n");
        for(List<LookupPair> row : lookup)
        {
            for(LookupPair col : row)
            {
                if(col.left.contains("Order"))
                {
                    continue;
                }
                if(col.right.contains(",") || col.right.contains("\r") 
                        || col.right.contains("\n")|| col.right.contains("\""))
                {
                    col.right = col.right.replace("\"", "\"\"");
                    col.right = "\""+col.right+"\"";
                }
                csvBuilder.append(col.right).append(',');
            }
            csvBuilder.append("\r\n");
        }
        return csvBuilder;
    }
   

}
