/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;
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
@WebServlet(name = "getResultSet", urlPatterns = {"/getResultSet"})
public class getResultSet extends HttpServlet {

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
        String queryLabel = request.getParameter("queryLabel");
        String queryParameters = request.getParameter("params");
        String whereclause = request.getParameter("whereclause");
        String callback = request.getParameter("callback");
        StringTokenizer st = new StringTokenizer(queryParameters,",");
		response.setContentType("text/javascript");
        PrintWriter out = response.getWriter();
        Database db = null;
        try{
            List<LookupPair> queryParametersMap = new ArrayList<LookupPair>();
            while(st.hasMoreElements())
            {
                String[] next = st.nextToken().split("=");
                if(next.length==2){
                    queryParametersMap.add(new LookupPair(next[0],next[1]));
                }
            }
            InitialContext cxt = new InitialContext(); 
            DataSource  ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"+application);
            db = new Database(ds);
            String jsonString = "";
            if(queryLabel.contains("_get_row"))
            {
                jsonString = db.getFactRow(application, queryLabel.replace("_get_row", ""),
                        queryParametersMap.get(0).right);
            }
            else
            {
                jsonString = db.getResultSet(application,queryLabel,queryParametersMap,whereclause);
            }
            if(callback != null)
            {
                jsonString = jsonString.replace("'", "\\'");
                jsonString = jsonString.replace("\\\\'", "\\'");
                jsonString = jsonString.replace("\\\"", "\\\\\"");
                jsonString = callback+"('"+jsonString+"')";
            }
            out.print(jsonString);
        }
        catch(Exception e)
        {
            Logger.log(application, e);
            out.append(e.toString());
            db.disconnect();
        }
        
        
        out.close();
    }

    
}
