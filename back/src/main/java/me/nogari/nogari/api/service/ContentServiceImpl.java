package me.nogari.nogari.api.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.jgit.util.IO;
import org.json.simple.parser.JSONParser;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.aws.LambdaCallFunction;
import me.nogari.nogari.api.aws.LambdaInvokeFunction;
import me.nogari.nogari.api.request.PostNotionToTistoryDto;

import me.nogari.nogari.api.response.KakaoAccessTokenResponse;
import me.nogari.nogari.api.response.TistoryCateDto;
import me.nogari.nogari.api.response.TistoryCateInterface;
import me.nogari.nogari.api.response.TistoryResponseInterface;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.entity.Tistory;
import me.nogari.nogari.repository.MemberRepository;
import me.nogari.nogari.repository.TistoryRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

	private final MemberRepository memberRepository;

	private final TistoryRepository tistoryRepository;

	private LambdaCallFunction lambdaCallFunction;

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
				BufferedReader blogInfoIn =  new BufferedReader(new InputStreamReader(blogInfo.getInputStream()));

				String line;
				if((line = blogInfoIn.readLine()) != null) {
					JSONArray blogInfoList = new JSONObject(line)
						.getJSONObject("tistory")
						.getJSONObject("item")
						.getJSONArray("blogs");

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

		if(filter.equals("오래된순")){
			tistoryList = tistoryRepository.sortTistoryByOldest(member.getMemberId()).orElseThrow(() -> {
				return new IllegalArgumentException("티스토리 발행 이력을 찾을 수 없습니다.");
			});
		}else{
			tistoryList = tistoryRepository.sortTistoryByNewest(member.getMemberId()).orElseThrow(() -> {
				return new IllegalArgumentException("티스토리 발행 이력을 찾을 수 없습니다.");
			});
		}

		blogNameList = getTistoryBlogName(blogNameList, member);
		categoriesList = getTistoryCates(blogNameList, categoriesList, member);

		List<Object> rslt = new ArrayList<>();
		rslt.add(tistoryList);
		rslt.add(blogNameList);

		rslt.add(categoriesList);
		// System.out.println(rslt);

		return rslt;
	}

	@Override
	public Object postNotionToTistory(List<PostNotionToTistoryDto> PostNotionToTistoryDtoList, Member member) {

		for(PostNotionToTistoryDto tistoryPosting : PostNotionToTistoryDtoList){
			String title = ""; // Tistory에 게시될 게시글 제목
			String content = ""; // Tistory에 게시될 게시글 내용

			// [발행요청] DB 저장
			Tistory tistory = Tistory.builder()
				.blogName(tistoryPosting.getBlogName())
				.requestLink(tistoryPosting.getRequestLink())
				.visibility(tistoryPosting.getVisibility())
				.categoryName(tistoryPosting.getCategoryName())
				.tagList(tistoryPosting.getTagList())
				.status("발행요청")
				.title(tistoryPosting.getTitle())
				.member(member)
				.build();
			tistoryRepository.save(tistory);

			// [변환진행] AWS Lambda와 통신하는 과정
			try{
				lambdaCallFunction = new LambdaCallFunction(
					tistoryPosting.getNotionToken(),
					tistoryPosting.getUrl(),
					tistoryPosting.getType()
				);
				content = lambdaCallFunction.post();

				try {
					ObjectMapper objectMapper = new ObjectMapper();
					Map<String, Object> data = objectMapper.readValue(content, Map.class);
					title = (String)data.get("title");
					content = (String)data.get("content");
				} catch(Exception e){
					e.printStackTrace();
				}
			} catch(IOException e){
				e.printStackTrace();
			}

			// [발행진행] Tistory API를 이용하여 Tistory 포스팅을 진행한다.
			member.getToken().getTistoryToken();

			RestTemplate rt = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();

			MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
			params.add("access_token", member.getToken().getTistoryToken());
			params.add("output", "");
			params.add("blogName", tistoryPosting.getBlogName()); // 블로그 이름
			params.add("title", title); // 글 제목
			params.add("content", content); // 글 내용
			params.add("visibility", "3"); // 발행 상태 : 기본값(발행)
			params.add("category", tistoryPosting.getCategoryName()); // 카테고리 아이디
			params.add("published", ""); // 발행 시간
			params.add("slogan", ""); // 문자 주소
			params.add("tag", tistoryPosting.getTagList()); // 태그 리스트(','로 구분)
			params.add("acceptComment", "1"); // 댓글 허용 :기본값(댓글 허용)
			params.add("password", ""); // 보호글 비밀번호

			HttpEntity<MultiValueMap<String, String>> TistoryPostRequest = new HttpEntity<>(params, headers);

			ResponseEntity<String> response = rt.exchange(
				"https://www.tistory.com/apis/post/write",
				HttpMethod.POST,
				TistoryPostRequest,
				String.class
			);

			String responseString = response.getBody().toString();
			System.out.println(responseString);

			// [발행검증]
			tistory.setStatus("발행완료");
		}
		return null;
	}
}
