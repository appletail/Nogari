package me.nogari.nogari.api.service;

import java.io.IOException;
import java.util.List;

import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.TistoryContentResponseDto;
import me.nogari.nogari.entity.Member;

public interface ContentService {

	List<Object> getTistoryList(String filter, Member member);

	Object getTistoryBlogName(List<String> blogNameList, Member member);

	Object getTistoryCates(List<String> blogNameList, List<Object> categories, Member member);
	// Object getTistoryCates(List<String> blogNameList, HashMap<String, List<Object>> categories, Member member);

	Object postNotionToTistory(List<PostNotionToTistoryDto> postNotionToTistoryDto, Member member);

	// [Multi Thread] : 사용자가 3개의 발행 요청시, 작업이 동시에 수행되어 총 16초가 소요된다.
	Object postNotionToTistoryMultiThread(List<PostNotionToTistoryDto> PostNotionToTistoryDtoList, Member member);

	List<TistoryContentResponseDto> getTistoryContents(Long lastTistoryId, int pageSize);

	void upload() throws IOException;

}
