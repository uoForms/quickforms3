/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package quickforms.dao;

/**
 *
 * @author achamney
 */
public class MetaField
{
	private String appName;
	private String factName;
	private String fieldName;
	private String columnName;
	private String referenceName;
	private String inputType;
	
	public String getAppName()
	{
		return appName;
	}
	
	public void setAppName(String appName)
	{
		this.appName = appName;
	}
	
	public String getFactName()
	{
		return factName;
	}
	
	public void setFactName(String factName)
	{
		this.factName = factName;
	}
	
	public String getFieldName()
	{
		return fieldName;
	}
	
	public void setFieldName(String fieldName)
	{
		this.fieldName = fieldName;
	}
	
	public String getColumnName()
	{
		return columnName;
	}
	
	public void setColumnName(String columnName)
	{
		this.columnName = columnName;
	}
	
	public String getReferenceName()
	{
		return referenceName;
	}
	
	public void setReferenceName(String referenceName)
	{
		this.referenceName = referenceName;
	}
	
	public String getInputType()
	{
		return inputType;
	}
	
	public void setInputType(String inputType)
	{
		this.inputType = inputType;
	}
	
}
