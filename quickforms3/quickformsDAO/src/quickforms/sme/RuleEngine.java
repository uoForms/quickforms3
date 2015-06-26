package quickforms.sme;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import quickforms.dao.LookupPair;

public interface RuleEngine
{
	public void process(Map<String, String[]> context, DataSource ds, String factID, List<List<LookupPair>> oldContextStr) throws Exception;
}
