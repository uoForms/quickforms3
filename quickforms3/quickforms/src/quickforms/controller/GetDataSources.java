/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.naming.InitialContext;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import quickforms.dao.Database;
import quickforms.dao.Logger;

/**
 *
 * @author achamney
 */
@WebServlet(name = "GetDataSources", urlPatterns = {"/getDataSources"})
public class GetDataSources extends HttpServlet {


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

        Database db = null;
        PrintWriter out = response.getWriter();
        try{
            InitialContext cxt = new InitialContext(); 
            NamingEnumeration<NameClassPair> ne = cxt.list("java:/comp/env/jdbc");
                        
            while (ne.hasMore()) {
                NameClassPair nc = (NameClassPair)ne.next();
                String connectionName = nc.getName();
                System.out.println(connectionName);
                
                out.write(". <div class=\"border\">");
                out.write(nc +"<br />");
                out.write("<h1>"+connectionName +"</h1>");
                DataSource  ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"+connectionName);
                db = new Database(ds); 
                try{
                    db.testConnection();
                    out.write("<div class='success'>Connection Succeeded! </div>"
                            + "<a href = \"/"+connectionName+"\">"+connectionName+"</a>&nbsp;"
                            + "<a href = \"users/?app="+connectionName+"\">Team Members </a>&nbsp;"
                            + "<a href = \"queries/?app="+connectionName+"\">Queries </a><br />");
                }
                catch(Exception e){
                    out.write("<div class='error'>Connection Failed!</div><br />"+e);
                }
                out.write("</div>");
            }
        }
        catch(Exception e)
        {
            Logger.log("quickforms", e);
            e.printStackTrace();
            db.disconnect();
        }
        out.close();
    }

}
