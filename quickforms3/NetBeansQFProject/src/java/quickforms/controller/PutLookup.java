/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import au.com.bytecode.opencsv.CSVReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import quickforms.dao.Database;
import quickforms.dao.Logger;
import quickforms.dao.LookupPair;

/**
 *
 * @author achamney
 */
@WebServlet(name = "PutLookup", urlPatterns = {"/putLookup"})
public class PutLookup extends HttpServlet {

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
       //response.setContentType("text/html;charset=UTF-8");
       String application ="";
       String field = ""; 
       System.out.println("Saving Lookup");
       Database db = null;
       String json = null;
       ArrayList<LookupPair> filter = null;
       PrintWriter out = response.getWriter();
        try{
            List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
            for(FileItem item : items)
            {
                if(item.getFieldName().equals("app"))
                {
                    application = item.getString();
                    InitialContext cxt = new InitialContext(); 
                    DataSource  ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/"+application);
                    db = new Database(ds);
                }
                else if(item.getFieldName().equals("field"))
                {
                    field = item.getString();
                }
                else if(item.getFieldName().equals("filter"))
                {
                    filter = GetMultiData.getFilterList(item.getString());
                }
            }
            for(FileItem item : items)
            {
                System.out.println("Item "+item);
                if (!item.isFormField()) {
                    File csv = saveFile(item);
                 
                    db.updateLookup(application,field,parseLookup(csv,field),filter);
                }
            }
        }
        catch(Exception e)
        {
           Logger.log(application, e);
           out.append("Error : "+e.toString());
           db.disconnect();
        }
       out.close();
    }

    private File saveFile(FileItem item) throws IOException {
        // Process form file field (input type="file").
        String filename = FilenameUtils.getName(item.getName());
        String home = System.getProperty("user.home");
        File imgFolder = new File(home+"/ulfiles/");
        if(!imgFolder.exists()) imgFolder.mkdir();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        File output2 = null;
        if(!filename.equals(""))
        {
            InputStream filecontent = item.getInputStream();
            
            int thisByte=filecontent.read();
            while(thisByte != -1)
            {
                baos.write(thisByte);
                thisByte=filecontent.read();
            }
            output2 = new File(home+"/ulfiles/"+filename);
            FileOutputStream fout = new FileOutputStream(output2);
            fout.write(baos.toByteArray());
            fout.close();
            
        }
        return output2;
    }

    private HashMap<String,HashMap<String,String>> parseLookup(File csv,String field) throws Exception {
        CSVReader cr = new CSVReader(new FileReader(csv));
        HashMap<String,HashMap<String,String>> lookup = new HashMap<String,HashMap<String,String>>();
        
        String[] header = cr.readNext();
        String[] curRow = cr.readNext();
        int rowNum=0;
        int curInsertKey = -1;
        while(curRow != null)
        {
            HashMap<String, String> row = new HashMap<String,String>();
            String key = "";
            for(int i=0;i<curRow.length;i++)
            {
                if(!header[i].isEmpty())
                {
                    if(header[i].contains("Key"))
                    {
                        key = curRow[i];
                        if(key == null || key.isEmpty())
                            key = Integer.toString(curInsertKey--);
                        row.put(header[i],key);
                    }
                    else
                    {
                        row.put(header[i],curRow[i]);
                    }
                }
            }
            row.put(field+"Order",Integer.toString(rowNum));
            lookup.put(key,row);
            curRow = cr.readNext();
            ++rowNum;
        }
        return lookup;
    }
    public static void main(String[] args)
    {
        PutLookup pl = new PutLookup();
        File f = new File(System.getProperty("user.home")+"\\Desktop\\initiative.csv");
        try{
            pl.parseLookup(f,"initiative");
        }catch(Exception e){e.printStackTrace();}
    }
}
