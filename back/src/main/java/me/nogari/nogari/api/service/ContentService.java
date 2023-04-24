package me.nogari.nogari.api.service;

import java.util.HashMap;
import java.util.List;


public interface ContentService {

	List<Object> getTistoryList(String filter);

	Object getTistoryBlogName(List<String> blogNameList);

	Object getTistoryCates(List<String> blogNameList, HashMap<String, List<Object>> categories);

	void githubConnectionTest();

}
