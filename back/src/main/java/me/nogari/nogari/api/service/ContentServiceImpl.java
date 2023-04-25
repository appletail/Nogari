package me.nogari.nogari.api.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.response.TistoryResponseDto;

import me.nogari.nogari.api.response.TistoryCateDto;
import me.nogari.nogari.api.response.TistoryCateInterface;
import me.nogari.nogari.api.response.TistoryResponseInterface;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.repository.MemberRepository;
import me.nogari.nogari.repository.TistoryRepository;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

	private final MemberRepository memberRepository;

	private final TistoryRepository tistoryRepository;

	@Override
	public List<String> getTistoryBlogName(List<String> blogNameList, Member member) {

		// 토큰에서 tistory accesstoken 받아오기
		String accessToken = member.getToken().getTistoryToken();

		if(!"".equals(accessToken) && accessToken != null){
			String blogInfoUrl = "https://www.tistory.com/apis/blog/info?"
				+ "access_token=" + accessToken
				+ "&output=json";

			try{
				URL url = new URL(blogInfoUrl);
				HttpURLConnection blogInfo = (HttpURLConnection) url.openConnection();

				// int responseCode = blogInfo.getResponseCode();
				// System.out.println("getBlogInfo responsecode = " + responseCode);

				BufferedReader blogInfoIn =  new BufferedReader(new InputStreamReader(blogInfo.getInputStream()));

				String line;
				if((line = blogInfoIn.readLine()) != null) {
					JSONArray blogInfoList = new JSONObject(line)
						.getJSONObject("tistory")
						.getJSONObject("item")
						.getJSONArray("blogs");

					// System.out.println(blogInfoList.toString());

					int cnt = 0;
					while(blogInfoList.length() > cnt){
						JSONObject blog = (JSONObject)blogInfoList.get(cnt++);
						blogNameList.add(blog.getString("name"));
					}
				}

			} catch (IOException e) {
				e.printStackTrace();
			}

		}

		return blogNameList;
	}

	@Override
	// public HashMap<String, List<Object>> getTistoryCates(List<String> blogNameList, HashMap<String, List<Object>> categoriesList, Member member){
	public List<Object> getTistoryCates(List<String> blogNameList,List<Object> categoriesList, Member member){

		// 토큰에서 tistory accesstoken 받아오기
		String accessToken = member.getToken().getTistoryToken();

		if(!"".equals(accessToken) && accessToken != null){
			String blogInfoUrl = "https://www.tistory.com/apis/category/list?"
				+ "access_token=" + accessToken
				+ "&output=json"
				+ "&blogName=";

			try{
				// 각 블로그에 등록된 카테고리 리스트 저장 후 반환
				for (String blogName : blogNameList){
					blogInfoUrl += blogName;

					URL url = new URL(blogInfoUrl);
					HttpURLConnection blogInfo = (HttpURLConnection) url.openConnection();

					int responseCode = blogInfo.getResponseCode();
					// System.out.println("getBlogInfo responsecode = " + responseCode);

					BufferedReader blogInfoIn =  new BufferedReader(new InputStreamReader(blogInfo.getInputStream()));

					String line;
					if((line = blogInfoIn.readLine()) != null) {
						JSONArray cateInfoList = new JSONObject(line)
							.getJSONObject("tistory")
							.getJSONObject("item")
							.getJSONArray("categories");

						List<TistoryCateDto> cate = new ArrayList<>();

						int cnt = 0;
						while(cateInfoList.length() > cnt){
							JSONObject category = (JSONObject)cateInfoList.get(cnt++);

							cate.add(new TistoryCateDto(
								category.getString("id").toString(),
								category.getString("name").toString(),
								category.getString("parent").toString(),
								category.getString("label").toString(),
								category.getString("entries").toString()
							));
						}

						categoriesList.add(cate);
					}
				}

			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return categoriesList;
	}

	@Override
	public List<Object> getTistoryList(String filter, Member member) {

		// 티스토리 발행 이력
		List<TistoryResponseInterface> tistoryList = new ArrayList<>();

		// 멤버의 블로그이름 리스트
		List<String> blogNameList = new ArrayList<>();

		// 블로그별 카테고리 리스트
		List<Object> categoriesList = new ArrayList<>();

		tistoryList = tistoryRepository.sortTistoryByFilter(member.getMemberId()).orElseThrow(() -> {
			return new IllegalArgumentException("티스토리 발행 이력을 찾을 수 없습니다.");
		});

		blogNameList = getTistoryBlogName(blogNameList, member);
		categoriesList = getTistoryCates(blogNameList, categoriesList, member);

		List<Object> rslt = new ArrayList<>();
		rslt.add(tistoryList);
		rslt.add(blogNameList);

		rslt.add(categoriesList);
		// System.out.println(rslt);

		return rslt;
	}

<<<<<<< back/src/main/java/me/nogari/nogari/api/service/ContentServiceImpl.java
	public void githubConnectionTest() {
	return;
	}
=======
>>>>>>> back/src/main/java/me/nogari/nogari/api/service/ContentServiceImpl.java
}
