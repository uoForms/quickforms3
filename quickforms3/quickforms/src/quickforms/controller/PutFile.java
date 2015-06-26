/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
package quickforms.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List; 
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import quickforms.dao.Database;

/**
 *
 * @author achamney
 */
@WebServlet(name = "PutFile", urlPatterns = {"/putFile"})
public class PutFile extends HttpServlet {

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
       System.out.println("Saving Fact");
       //response.setContentType("text/html;charset=UTF-8");
       HashMap<String,String> parameters = new HashMap<String,String>();
       Database db = null;
       String json = null;
       String folder = "C:/images/";
       folder = request.getParameter("folder");
       System.out.println(folder);
       PrintWriter out = response.getWriter();
        try{
            
            List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
            for(FileItem item : items)
            {
                 if (item.isFormField()) {
                    if(item.getFieldName().equals("folder"))
                    {
                        folder = item.getString();
                    }
                } 
            }
            for(FileItem item : items)
            {
                if (!item.isFormField()) {
                    saveFile(item,folder);
                    out.write(item.getName());
                }
                
            }
        }
        catch(Exception e)
        {
            out.write(e.toString());
        }
       out.close();
    }

    private void saveFile(FileItem item, String folderStr) throws IOException {
        // Process form file field (input type="file").
        String fieldname = item.getFieldName();
        String filename = FilenameUtils.getName(item.getName());
        
        File imgFolder = new File(folderStr);
        if(!imgFolder.exists()) imgFolder.mkdir();
        
        if(!filename.equals(""))
        {
            InputStream filecontent = item.getInputStream();
            
            if(filename.contains(".zip"))
            {
                //ByteArrayOutputStream out = new ByteArrayOutputStream();
                String foldername = folderStr+filename.substring(0, filename.length()-4);
                File folder = new File(foldername);
                if(!folder.exists()){
                        folder.mkdir();
                }
                unZipZipFileToLocation(filecontent,folder);
            }
            else
            {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                int thisByte=filecontent.read();
                while(thisByte != -1)
                {
                    baos.write(thisByte);
                    thisByte=filecontent.read();
                }
                File output2 = new File(folderStr+filename);
                FileOutputStream fout = new FileOutputStream(output2);
                fout.write(baos.toByteArray());
                fout.close();
            }  
        }
        // ... (do your job here)
    }
     public void unZipZipFileToLocation(InputStream flInStr, File targetDir)
          throws IOException{

    try{
      ZipInputStream zis = new ZipInputStream(flInStr);
      try{
        ZipEntry entry = null;
        while((entry = zis.getNextEntry()) != null){
          String name = entry.getName();
          File newFile = new File(targetDir, name);
          if (entry.isDirectory() && ! newFile.exists() ){
            newFile.mkdirs();
          }
          else if (! entry.isDirectory() ){
            if (newFile.exists()){
              newFile.delete();
            }
            File parentDir = newFile.getParentFile();
            if (! parentDir.exists()){
              parentDir.mkdirs();
            }
            FileOutputStream stmOut = new FileOutputStream(newFile);
            try{
              simpleInputStreamToOutputStream(zis, stmOut);
            }
            finally{
              stmOut.close();
            }
          }
        }//end while.
      }
      finally{
        zis.close();
      }
    }
    finally{
      flInStr.close();
    }  
  }
     
  private void simpleInputStreamToOutputStream(InputStream stmIn, OutputStream stmOut)
          throws IOException{

      IOUtils.copy(stmIn, stmOut);
//    byte[] buffer = null;
//    int iBufferSize = 8096;
//    buffer = new byte[iBufferSize];
//
//    boolean bKeepStreaming = true;
//    while (bKeepStreaming){
//      int iBytes = stmIn.read(buffer);
//      if (iBytes == -1){
//        bKeepStreaming = false;
//      }
//      else{
//        stmOut.write(buffer, 0, iBytes);
//      }//end else some bytes returned.
//    }//end while
  }

}
