/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package quickforms.dao;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.GregorianCalendar;

/**
 *
 * @author achamney
 */
public class Logger
{
	public static void log(String app, Exception log)
	{
		File f = new File(app + "Log.log");
		BufferedWriter bw;
		try
		{
			bw = new BufferedWriter(new FileWriter(f, true));
			bw.write(new GregorianCalendar().getTime() + " " + log + "\n");
			for (StackTraceElement ste : log.getStackTrace())
			{
				bw.write("    " + ste + "\n");
			}
			System.out.println(log);
			bw.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static void log(String app, String log)
	{
		File f = new File(app + "Log.log");
		BufferedWriter bw;
		try
		{
			bw = new BufferedWriter(new FileWriter(f, true));
			bw.write(new GregorianCalendar().getTime() + " " + log + "\n");
			System.out.println(log);
			bw.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
