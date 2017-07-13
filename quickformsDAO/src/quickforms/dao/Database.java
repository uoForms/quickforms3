/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package quickforms.dao;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.LookupPair;
import quickforms.dao.MetaField;
import quickforms.sme.NewThreadForDispatcher;
import quickforms.sme.NewPregappNotificationDispatcher;

public class Database implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7827763234183986112L;
	private Connection conn;
	private Statement st;
	private DataSource ds;
	
	public Database(DataSource ds)
	{
		this.ds = ds;
	}
	
	public void testConnection() throws Exception
	{
		conn = ds.getConnection();
		st = conn.createStatement();
		disconnect();
	}
	
	public void disconnect()
	{
		try
		{
			st.close();
			conn.close();
		}
		catch (SQLException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void connect()
	{
		try
		{
			conn = ds.getConnection();
			while (!conn.isValid(30))
			{
				conn.close();
				conn = ds.getConnection();
				Logger.log("quickforms", new Exception("Resetting Connection"));
			}
			st = conn.createStatement();
		}
		catch (SQLException e)
		{
			// TODO Auto-generated catch block
			Logger.log("quickforms", e);
			e.printStackTrace();
		}
	}
	
	public void putComboBox(Map<String, String[]> params, String application, String lookupTable, String value) throws Exception
	{
		connect();
		List<MetaField> metas = getMeta(application, lookupTable, true);
		conn.setAutoCommit(false);
		String sql = buildInsertSql(metas, application, lookupTable);
		PreparedStatement pst = conn.prepareStatement(sql);
		for (int i = 0; i < metas.size(); i++)
		{
			pst.setString(i + 1, value);
		}
		
		System.out.println(sql);
		pst.execute();
		conn.commit();
		conn.setAutoCommit(true);
		
		disconnect();
	}
	
	/**
	 * Insert data into FACT table
	 * @param Map<String, String[]> params
	 * @param String app
	 * @param String fact
	 * @param List<LookupPair> multiKeys
	 * @return Integer rowId
	 * @throws Exception
	 */
	public int putFact(Map<String, String[]> params, String app, String fact, List<LookupPair> multiKeys) throws Exception
	{
		connect();
		List<MetaField> metas = getMeta(app, "FACT_" + fact, false);
		params = createMultiKeys(metas, multiKeys, params);
		conn.setAutoCommit(false);
		String sql = buildInsertSql(metas, app, "FACT_" + fact);
		PreparedStatement pst = conn.prepareStatement(sql);
		for (int i = 0; i < metas.size(); i++)
		{
			// System.out.print(metas.get(i).getColumnName());
			if (params.get(metas.get(i).getColumnName()) != null)
			{
				String enteredData = params.get(metas.get(i).getColumnName())[0];
				pst.setString(i + 1, enteredData);
			}
			else if(metas.get(i).getColumnName().equals("userRole")){
				pst.setString(i + 1, "2");
			}
			else
			{
				pst.setString(i + 1, "0");
			}
		}
		
		System.out.println(sql);
		pst.execute();
		conn.commit();
		conn.setAutoCommit(true);
		
		// Statement st = conn.createStatement();
		sql = "select max(" + fact + "Key) as id from " + "FACT_" + fact;
		System.out.println(sql);
		ResultSet rs = st.executeQuery(sql);
		int rowId = -1;
		while (rs.next())
		{
			rowId = Integer.parseInt(rs.getString("id"));
		}
		disconnect();
		return rowId;
	}
	
	public void updateFact(Map<String, String[]> params, String app, String fact, String rowId, List<LookupPair> multiKeys) throws Exception
	{
		connect();
		
		List<MetaField> metas = getMeta(app, "FACT_" + fact, false);
		params = createMultiKeys(metas, multiKeys, params);
		conn.setAutoCommit(false);
		String sql = buildUpdateSql(metas, app, fact, rowId, params);
		PreparedStatement pst = conn.prepareStatement(sql);
		int questionReplaceCounter = 1;
		for (int i = 0; i < metas.size(); i++)
		{
			if (params.get(metas.get(i).getColumnName()) != null)
			{
				// System.out.print(metas.get(i).getColumnName());
				String enteredData = params.get(metas.get(i).getColumnName())[0];
				pst.setString(questionReplaceCounter++, enteredData);
			}
			// else
			// {
			// st.setString(i+1,"-1");
			// }
		}
		
		System.out.println(sql);
		pst.execute();
		conn.commit();
		conn.setAutoCommit(true);
		
		disconnect();
	}
	
	/**
	 * Use the system view information_schema.columns to get the structure of the specified table
	 * @param String app as quickforms app name, as well as database name
	 * @param String fact as table name
	 * @param Boolean includeId as ?
	 * @return List<MetaField> mfs as structure of the table
	 * @throws Exception
	 */
	public List<MetaField> getMeta(String app, String fact, boolean includeId) throws Exception // ///
																								// MUST
																								// BE
																								// CONNECTED
																								// FIRST
	{
		List<MetaField> mfs = new ArrayList<MetaField>();
		
		useApp(app);
		
		String sql = getQuery(app, "getFactMetadata");
		sql = sql.replace("?", "'" + fact + "'");
		System.out.println(sql);
		ResultSet rs = st.executeQuery(sql);
		while (rs.next())
		{
			
			MetaField mf = new MetaField();
			// mf.setInputType(rs.getString("DATA_TYPE"));
			mf.setAppName(app);
			mf.setFactName(fact);
			mf.setColumnName(rs.getString("field"));
			if (!mf.getColumnName().toLowerCase().contains("key") || includeId)
			{
				mfs.add(mf);
			}
		}
		rs.close();
		
		return mfs;
	}
	
	/**
	 * Build the insert SQL
	 * @param List<MetaField> metas
	 * @param String app
	 * @param String fact
	 * @return String sql
	 */
	public String buildInsertSql(List<MetaField> metas, String app, String fact)
	{
		String sql = "insert into " + fact + "( ";
		for (int i = 0; i < metas.size(); i++)
		{
			if (i > 0)
			{
				sql += ",";
			}
			sql += metas.get(i).getColumnName();
		}
		sql += ") values(";
		for (int i = 0; i < metas.size(); i++)
		{
			if (i > 0)
			{
				sql += ",";
			}
			sql += "?";
		}
		return sql + ");";
	}
	
	public String buildUpdateSql(List<MetaField> metas, String app, String fact, String rowId, Map<String, String[]> params)
	{
		String sql = "update " + "FACT_" + fact + " set ";
		
		boolean afterFirst = false;
		for (int i = 0; i < metas.size(); i++)
		{
			if (params.get(metas.get(i).getColumnName()) != null)
			{
				if (afterFirst)
				{
					sql += ",";
				}
				afterFirst = true;
				sql += metas.get(i).getColumnName() + "= ? ";
			}
		}
		return sql + "where " + fact + "Key = " + rowId + " ;";
	}
	
	public String getResultSet(String app, String queryLabel, List<LookupPair> params, String whereclause, String orderbyclause, String likeclause)
			throws Exception
	{
		connect();
		String jsonRS = "";
		System.out.println("gettingQuery " + queryLabel);
		String preparedQuery = getQuery(app, queryLabel); // /// Get query from
															// database
		if (whereclause != null)
		{
			preparedQuery = preparedQuery.replace("%WHERECLAUSE%", " where " + whereclause + " ");
			preparedQuery = preparedQuery.replace("%ANDCLAUSE%", " and " + whereclause + " ");
			preparedQuery = preparedQuery.replace("%ORDERBYCLAUSE%", " order by " + orderbyclause + " ");
			preparedQuery = preparedQuery.replace("%LIKECLAUSE%", " LIKE '%" + likeclause + "%' ");
		}
		System.out.println("Found Query " + preparedQuery);
		conn.setAutoCommit(false);
		PreparedStatement pst = conn.prepareStatement(preparedQuery);
		
		if (params != null)
		{ // / add parameters to the query (if any)
			int i = 0;
			for (LookupPair param : params)
			{
				System.out.println(param.left + " " + param.right);
				if (isNumber(param.right))
				{
					pst.setInt(++i, Integer.parseInt(param.right));
				}
				else
				{
					pst.setString(++i, param.right);
				}
			}
		}
		System.out.println(pst.toString());
		
		ResultSet rs = pst.executeQuery(); // / run query to get the results
		jsonRS = mapToJSON(resultSetToMap(rs));
		conn.setAutoCommit(true);
		// System.out.println(jsonRS);
		disconnect();
		return jsonRS;
	}
	
	public String executeQuery(String app, String queryLabel, HashMap<String, String> params) throws Exception
	{
		connect();
		String preparedQuery = getQuery(app, queryLabel); // /// Get query from
															// database
		
		conn.setAutoCommit(false);
		PreparedStatement pst = conn.prepareStatement(preparedQuery);
		
		if (params != null)
		{ // / add parameters to the query (if any)
			int i = 0;
			for (String param : params.keySet())
			{
				System.out.println(param + " " + params.get(param));
				pst.setString(++i, params.get(param));
			}
		}
		System.out.println(pst.toString());
		
		boolean rs = pst.execute(); // / run query
		conn.setAutoCommit(true);
		
		disconnect();
		return "Success!";
	}
	
	public List<LookupPair> getLookupData(String application, String field) throws Exception
	{
		List<LookupPair> map = new ArrayList<LookupPair>();
		String catAndClause = "";
		
		connect();
		useApp(application);
		field = field.replace("Multi", "");
		String sql = "select " + field + "Key, " + field + "Label, " + field + "Order from lkup_" + field + " order by " + field + "Order";
		
		ResultSet rs = st.executeQuery(sql);
		
		while (rs.next())
		{
			map.add(new LookupPair(rs.getString(1), rs.getString(2), rs.getString(3)));
		}
		rs.close();
		disconnect();
		return map;
	}
	
	public List<List<LookupPair>> getMultiData(String application, String field, List<LookupPair> category) throws Exception
	{
		List<List<LookupPair>> map = new ArrayList<List<LookupPair>>();
		StringBuilder catAndClause = new StringBuilder();
		if (category != null)
		{
			int i = 0;
			for (LookupPair lp : category)
			{
				if (!lp.right.equals("") && !lp.left.isEmpty())
					catAndClause.append(" and ").append(lp.left).append(" = '").append(lp.right).append("'");
			}
		}
		connect();
		useApp(application);
		field = field.replace("Multi", "");
		StringBuilder sql = new StringBuilder("select * from lkup_").append(field).append(" where ").append(field).append("Order > -1 ")
				.append(catAndClause).append(" order by ").append(field).append("Order");
		System.out.println(sql);
		ResultSet rs = st.executeQuery(sql.toString());
		ResultSetMetaData rsmd = rs.getMetaData();
		while (rs.next())
		{
			List<LookupPair> multiData = new ArrayList<LookupPair>(rsmd.getColumnCount());
			for (int i = 1; i <= rsmd.getColumnCount(); i++)
			{
				multiData.add(new LookupPair(rsmd.getColumnLabel(i), rs.getString(i)));
			}
			map.add(multiData);
		}
		rs.close();
		disconnect();
		return map;
	}
	
	public List<List<LookupPair>> getFactRowMap(String app, String factTable, String updateId) throws Exception
	{
		connect();
		useApp(app);
		String sql = "select * , " + factTable + "Key as id from " + "FACT_" + factTable + " where " + factTable + "Key = " + updateId + ";";
		ResultSet rs = st.executeQuery(sql);
		
		List<List<LookupPair>> map = resultSetToMap(rs);
		disconnect();
		return map;
	}
	
	public String getFactRow(String app, String factTable, String updateId) throws Exception
	{
		String jsonRS = mapToJSON(getFactRowMap(app, factTable, updateId));
		return jsonRS;
	}
	
	public String deleteFactRow(String application, String factTable, String id) throws Exception
	{
		connect();
		useApp(application);
		String sql = "update FACT_" + factTable + " set deleteFlag = 1 where " + factTable + "Key = " + id + ";";
		boolean rs = st.execute(sql);
		disconnect();
		return "" + rs;
	}
	
	// added By Priyanka to delete a Fact
	public String deleteFact(String application, String factTable, String id) throws Exception
	{
		connect();
		useApp(application);
		String sql = "DELETE FROM FACT_" + factTable + " where " + factTable + "Key = " + id + ";";
		boolean rs = st.execute(sql);
		disconnect();
		return "" + rs;
	}
	
	public String getQuery(String app, String queryLabel) throws Exception
	{
		useApp(app);
		String sql = "select * from fact_queries where queryLabel like '" + queryLabel + "';";
		ResultSet rs = st.executeQuery(sql);
		String preparedQuery = "";
		while (rs.next())
		{
			preparedQuery = rs.getString("query");// find the query in the
													// queries table
		}
		rs.close();
		return preparedQuery;
	}
	
	/**
	 * Identify the database name for the sql.
	 * @param app as the app's name, as well as the database name.
	 * @throws Exception
	 */
	public void useApp(String app) throws Exception // MUST BE CONNECTED FIRST
	{
		if (app.contains("-"))
		{
			app = "[" + app + "]";
		}
		String sql = "use " + app + ";"; // set ms sql to get metadata from this
											// app.
		st.execute(sql);
	}
	
	public String mapToJSON(List<List<LookupPair>> rs) throws Exception
	{
		// ResultSetMetaData rsmd = rs.getMetaData();
		
		StringBuilder jsonRS = new StringBuilder("[");
		for (List<LookupPair> row : rs)
		{
			jsonRS.append("{");
			for (LookupPair key : row)
			{
				String elem = key.right;
				if (elem != null)
				{
					elem = elem.replace("\"", "\\\"");
				}
				jsonRS.append("\"").append(key.left).append("\":\"").append(elem).append("\",");
			}
			jsonRS.setCharAt(jsonRS.length() - 1, '}'); // / Take off the last
														// comma and end the
														// second bracket
			jsonRS.append(",");
		}
		jsonRS.setCharAt(jsonRS.length() - 1, ']'); // / Take off the last comma
													// and end the first bracket
		return jsonRS.toString();
		
	}
	
	public List<List<LookupPair>> resultSetToMap(ResultSet rs) throws Exception
	{
		ResultSetMetaData rsmd = rs.getMetaData();
		
		List<List<LookupPair>> mapList = new ArrayList<List<LookupPair>>();
		while (rs.next()) // / add all results to JSON string
		{
			List<LookupPair> row = new ArrayList<LookupPair>();
			int columnCount = rsmd.getColumnCount();
			for (int i = 1; i <= columnCount; ++i)
			{
				String elem = rs.getString(i);
				if (elem != null)
				{
					elem = elem.replace("\"", "\\\"");
				}
				row.add(new LookupPair(rsmd.getColumnName(i), elem));
			}
			mapList.add(row);
		}
		rs.close();
		return mapList;
		
	}
	
	public List<LookupPair> getMultiByKey(String app, String factTable, String lkupName, String key) throws Exception
	{
		List<LookupPair> pairs = new ArrayList<LookupPair>();
		connect();
		useApp(app);
		
		String sql = "select " + lkupName + " from fact_" + factTable + " where " + factTable + "Key = " + key + ";";
		ResultSet rs = st.executeQuery(sql);
		rs.next();
		int multiKey = rs.getInt(1);
		rs.close();
		
		sql = "select * from " + "LKUP_" + lkupName + " where " + lkupName + "Key = " + multiKey + ";";
		rs = st.executeQuery(sql);
		
		while (rs.next()) // / add all results to JSON string
		{
			LookupPair pair = new LookupPair();
			pair.left = rs.getString(1);
			pair.right = rs.getString(2);
			// To support CWS - This should need to be refactored
			if(rs.getString(3) != null){
			   pair.right2 = rs.getString(3);
			}
			pairs.add(pair);
		}
		rs.close();
		disconnect();
		return pairs;
	}
	
	public void putManyToMany(String app, String lookup, String[] vals, 
			                  Map<String, String> thirdColumns, String oldId, String multiId) throws Exception
	{
		connect();
		{
			useApp(app);
			// if(update)
			// {
			
			String deleteQuery = "delete from lkup_" + lookup + " where " + lookup + "Key = " + oldId;
			System.out.println(deleteQuery);
			st.execute(deleteQuery);
			// }
			String sql = "insert into lkup_" + lookup + " values ";
			int i = 0;
			for (String val : vals)
			{
				if (i > 0)
				{
					sql += ",";
				}
				if(thirdColumns != null){
					sql += "(" + multiId + "," + val + ",\'" + thirdColumns.get(val)+"\')";
				}else{
					sql += "(" + multiId + "," + val + ")";
				}
				i++;
			}
			Logger.log(app, sql);
			st.execute(sql);
		}
		disconnect();
	}
	
	public boolean isNumber(String right)
	{
		try
		{
			Integer.parseInt(right);
			return true;
		}
		catch (NumberFormatException e)
		{
			return false;
		}
	}
	
	public Map<String, String[]> createMultiKeys(List<MetaField> metas, List<LookupPair> multiKeys, Map<String, String[]> params) throws SQLException
	{
		Map<String, String[]> factParams = new HashMap<String, String[]>(params);
		for (MetaField mf : metas)
		{
			String dbColumn = mf.getColumnName().toLowerCase();
			if (dbColumn.contains("multi"))
			{
				ResultSet rs = st.executeQuery("select max(" + dbColumn + "Key) from lkup_" + dbColumn);
				
				int maxMultiKey = 1;
				if (rs.next())
				{
					maxMultiKey = rs.getInt(1) + (int) (Math.random() * 40) + 1;
				}
				multiKeys.add(new LookupPair(dbColumn, "" + maxMultiKey));
				rs.close();
				
				/*
				 * for(String key : factParams.keySet()) // Commented out,
				 * caused updates with no multis selected to not work {
				 * if(key.toLowerCase().equals(dbColumn)) {
				 */
				factParams.put(mf.getColumnName(), new String[] { "" + maxMultiKey });
				// }
				// }
			}
		}
		return factParams;
	}
	
	public void updateLookup(String app, String lookup, HashMap<String, HashMap<String, String>> jsonHashMap, ArrayList<LookupPair> filter)
			throws Exception
	{
		StringBuilder filterWhereClause = new StringBuilder();
		if (filter != null)
		{
			for (LookupPair lp : filter)
			{
				if (!lp.right.equals(""))
					filterWhereClause.append(" where ").append(lp.left).append(" = '").append(lp.right).append("'");
			}
		}
		
		connect();
		useApp(app);
		conn.setAutoCommit(false);
		
		ResultSet rs = st.executeQuery("select max(" + lookup + "Key) from lkup_" + lookup);
		int maxLkupKey = 1;
		if (rs.next())
		{
			maxLkupKey = rs.getInt(1) + 1;
		}
		
		List<String> updateSql = createUpdateValues(jsonHashMap, lookup);
		List<String> insertSql = createInsertValues(jsonHashMap, lookup, maxLkupKey);
		
		String sql = "update lkup_" + lookup + " set " + lookup + "Order = -1 " + filterWhereClause.toString(); // Delete
																												// all
																												// old
																												// values
		st.execute(sql);
		
		sql = "update lkup_" + lookup + " set "; // update all existing values
		for (String values : updateSql)
		{
			System.out.println(sql + values);
			st.execute(sql + values);
		}
		sql = "insert into lkup_" + lookup + " "; // insert new values
		for (String values : insertSql)
		{
			System.out.println(sql + values);
			st.execute(sql + values);
		}
		
		conn.commit();
		conn.setAutoCommit(true);
		disconnect();
	}
	
	public List<String> createUpdateValues(HashMap<String, HashMap<String, String>> jsonHashMap, String lookup)
	{
		List<String> valueSqls = new ArrayList<String>();
		for (String key : jsonHashMap.keySet())
		{
			if (Integer.parseInt(key) >= 0)
			{
				HashMap<String, String> row = jsonHashMap.get(key);
				StringBuilder valueSql = new StringBuilder();
				int i = 0;
				for (String colKey : row.keySet())
				{
					if (!colKey.contains("Key"))
					{
						String val = row.get(colKey);
						if (i > 0)
							valueSql.append(" , ");
						
						if (isNumber(val))
							valueSql.append(colKey).append(" = ").append(val).append(" ");
						else
						{
							val = val.replace("'", "''");
							valueSql.append(colKey).append(" = ").append("'").append(val).append("'").append(" ");
						}
						++i;
					}
				}
				valueSql.append(" where ").append(lookup).append("Key = ").append(key);
				valueSqls.add(valueSql.toString());
			}
		}
		return valueSqls;
	}
	
	public List<String> createInsertValues(HashMap<String, HashMap<String, String>> jsonHashMap, String lookup, int maxKey)
	{
		List<String> valueSqls = new ArrayList<String>();
		StringBuilder columnSql = new StringBuilder("(");
		for (String key : jsonHashMap.keySet())
		{
			HashMap<String, String> row = jsonHashMap.get(key);
			int i = 0;
			for (String colKey : row.keySet())
			{
				if (i > 0)
					columnSql.append(",");
				columnSql.append(colKey);
				++i;
			}
			columnSql.append(")");
			break;
		}
		for (String key : jsonHashMap.keySet())
		{
			if (Integer.parseInt(key) < 0)
			{
				HashMap<String, String> row = jsonHashMap.get(key);
				StringBuilder valueSql = new StringBuilder(" values (");
				
				int i = 0;
				for (String colKey : row.keySet())
				{
					if (i > 0)
						valueSql.append(" , ");
					if (!colKey.contains("Key"))
					{
						String val = row.get(colKey);
						
						if (isNumber(val))
							valueSql.append(val).append(" ");
						else
						{
							val = val.replace("'", "''");
							valueSql.append("'").append(val).append("'").append(" ");
						}
					}
					else
					{
						valueSql.append(maxKey++).append(" ");
					}
					++i;
				}
				valueSql.append(")");
				valueSqls.add(columnSql.toString() + valueSql.toString());
			}
		}
		return valueSqls;
	}
	
	public String putFactProcess(Map<String, String[]> params, Database db) throws Exception
	{
		String application = params.get("app")[0];
		String factTable = params.get("factTable")[0];
		String rowId = null;
		String callback = null;
		if (params.containsKey("callback"))
			callback = params.get("callback")[0];
		if (params.containsKey("updateid"))
			rowId = params.get("updateid")[0];
		
		List<List<LookupPair>> oldRecord = null;
		
		List<LookupPair> multiKeys = new ArrayList<LookupPair>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		String curDate = formatter.format(System.currentTimeMillis());
		params.put("updatedDate", new String[] { curDate });
		if (rowId == null || rowId.equals("null"))
		{
			params.put("createdDate", new String[] { curDate });
			rowId = "" + db.putFact(params, application, factTable, multiKeys);
			findManyToMany(application, db, params, null, multiKeys);
		}
		else
		{
			oldRecord = db.getFactRowMap(application, factTable, rowId);
			db.updateFact(params, application, factTable, rowId, multiKeys);
			findManyToMany(application, db, params, oldRecord, multiKeys);
		}
		NewThreadForDispatcher ntDispatcher = new NewThreadForDispatcher(params, ds, rowId, oldRecord);
		Thread t = new Thread(ntDispatcher);
		t.start();
		
		String json = "[{\"id\":\"" + rowId + "\"}]";
		if (callback != null)
		{
			json = json.replace("'", "\\'");
			json = json.replace("\\\\'", "\\'");
			json = json.replace("\\\"", "\\\\\"");
			json = callback + "('" + json + "')";
		}
		return json;
	}
	
	public void findManyToMany(String app, Database db, Map<String, String[]> params, List<List<LookupPair>> oldRecord, List<LookupPair> multiKeys)
	{
		for (String param_key : params.keySet())
		{
			if (param_key.toLowerCase().contains("multi")) // means there is a
															// many to many
															// relationship
			{
				String multiId = findMultiVal(multiKeys, param_key); // matches
																		// database
																		// col
																		// name
																		// to
																		// html
																		// name
				try
				{
					String oldId = "-1";
					if (oldRecord != null)
					{
						for (LookupPair col : oldRecord.get(0))
						{
							if (param_key.equals(col.left))
								oldId = col.right;
						}
					}
					
					Map<String, String> commentMap = new HashMap<>();
					boolean hasThirdColumn = false;
					for(String key: params.keySet()){
						if(key.contains("comment_")){
							hasThirdColumn = true;
							String comment = params.get(key)[0];
							String id = key.substring(8);
							commentMap.put(id, comment);
						}
					}
					if(hasThirdColumn)
						db.putManyToMany(app, param_key, params.get(param_key), commentMap, oldId, multiId);
					else
						db.putManyToMany(app, param_key, params.get(param_key), null, oldId, multiId);
				}
				catch (Exception e)
				{
					Logger.log(app, e);
					db.disconnect();
				}
			}
		}
	}
	
	public String sendPregAppNotifications(Map<String, String[]> params, Database db) throws Exception
	{		
		String rowId = null;
		String callback = null;
		
		if (params.containsKey("callback"))
			callback = params.get("callback")[0];
		
		
		NewPregappNotificationDispatcher ntDispatcher = new NewPregappNotificationDispatcher(params, ds, null, null);
		Thread t = new Thread(ntDispatcher);
		t.start();
		
		String json = "[{\"id\":\"" + rowId + "\"}]";
		if (callback != null)
		{
			json = json.replace("'", "\\'");
			json = json.replace("\\\\'", "\\'");
			json = json.replace("\\\"", "\\\\\"");
			json = callback + "('" + json + "')";
		}
		return json;
	}
	
	private String findMultiVal(List<LookupPair> multiKeys, String param_key)
	{
		for (LookupPair lp : multiKeys)
		{
			if (lp.left.toLowerCase().equals(param_key.toLowerCase()))
			{
				return lp.right;
			}
		}
		return "";
	}
	
}
