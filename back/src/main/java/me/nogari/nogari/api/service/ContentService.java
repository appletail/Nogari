package me.nogari.nogari.api.service;

import java.util.HashMap;
import java.util.List;

import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.categoriesDto;
import me.nogari.nogari.common.JWTDto;

public interface ContentService {

	List<Object> getTistoryList(String filter);

	Object getTistoryBlogName(List<String> blogNameList);

	Object getTistoryCates(List<String> blogNameList, HashMap<String, List<Object>> categories);

	Object postNotionToTistory(PostNotionToTistoryDto postNotionToTistoryDto);

}
