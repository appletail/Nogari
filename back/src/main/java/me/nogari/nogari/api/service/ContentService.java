package me.nogari.nogari.api.service;

import java.util.HashMap;
import java.util.List;

import me.nogari.nogari.api.response.categoriesDto;
import me.nogari.nogari.common.JWTDto;
import me.nogari.nogari.entity.Member;

public interface ContentService {

	List<Object> getTistoryList(String filter, Member member);

	Object getTistoryBlogName(List<String> blogNameList, Member member);

	Object getTistoryCates(List<String> blogNameList, List<Object>categories, Member member);
	// Object getTistoryCates(List<String> blogNameList, HashMap<String, List<Object>> categories, Member member);


}
