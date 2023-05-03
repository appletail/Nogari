package me.nogari.nogari.api.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.aws.LambdaCallFunction;
import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.TistoryCateDto;
import me.nogari.nogari.api.response.TistoryContentResponseDto;
import me.nogari.nogari.api.response.TistoryResponseInterface;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.entity.Tistory;
import me.nogari.nogari.repository.MemberRepository;
import me.nogari.nogari.repository.TistoryRepository;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonParseException;

import me.nogari.nogari.repository.TistoryRepositoryCust;


@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

	// 초기 스레드 수 : 0, 코어 스레드 수 : 0, 최대 스레드 수 : Integer.MAX_VALUE
	// 추가된 스레드가 60초동안 아무 작업을 수행하지 않으면 ThreadPool에서 제거한다.
	private ExecutorService executorService;

	private final MemberRepository memberRepository;

	private final TistoryRepository tistoryRepository;

	private LambdaCallFunction lambdaCallFunction;

	private final TistoryRepositoryCust tistoryRepositoryCust;

	@Override
	public List<String> getTistoryBlogName(List<String> blogNameList, Member member) {

		// 토큰에서 tistory accesstoken 받아오기
		String accessToken = member.getToken().getTistoryToken();

		if (!"".equals(accessToken) && accessToken != null) {
			String blogInfoUrl = "https://www.tistory.com/apis/blog/info?"
				+ "access_token=" + accessToken
				+ "&output=json";

			try {
				URL url = new URL(blogInfoUrl);
				HttpURLConnection blogInfo = (HttpURLConnection)url.openConnection();

				// int responseCode = blogInfo.getResponseCode();
				// System.out.println("getBlogInfo responsecode = " + responseCode);

				BufferedReader blogInfoIn = new BufferedReader(new InputStreamReader(blogInfo.getInputStream()));

				String line;
				if ((line = blogInfoIn.readLine()) != null) {
					JSONArray blogInfoList = new JSONObject(line)
						.getJSONObject("tistory")
						.getJSONObject("item")
						.getJSONArray("blogs");

					int cnt = 0;
					while (blogInfoList.length() > cnt) {
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
	public List<Object> getTistoryCates(List<String> blogNameList, List<Object> categoriesList, Member member) {

		// 토큰에서 tistory accesstoken 받아오기
		String accessToken = member.getToken().getTistoryToken();

		if (!"".equals(accessToken) && accessToken != null) {
			String blogInfoUrl = "https://www.tistory.com/apis/category/list?"
				+ "access_token=" + accessToken
				+ "&output=json"
				+ "&blogName=";

			try {
				// 각 블로그에 등록된 카테고리 리스트 저장 후 반환
				for (String blogName : blogNameList) {
					blogInfoUrl += blogName;

					URL url = new URL(blogInfoUrl);
					HttpURLConnection blogInfo = (HttpURLConnection)url.openConnection();

					int responseCode = blogInfo.getResponseCode();
					// System.out.println("getBlogInfo responsecode = " + responseCode);

					BufferedReader blogInfoIn = new BufferedReader(new InputStreamReader(blogInfo.getInputStream()));

					String line;
					if ((line = blogInfoIn.readLine()) != null) {
						JSONArray cateInfoList = new JSONObject(line)
							.getJSONObject("tistory")
							.getJSONObject("item")
							.getJSONArray("categories");

						List<TistoryCateDto> cate = new ArrayList<>();

						int cnt = 0;
						while (cateInfoList.length() > cnt) {
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

		if (filter.equals("오래된순")) {
			tistoryList = tistoryRepository.sortTistoryByOldest(member.getMemberId()).orElseThrow(() -> {
				return new IllegalArgumentException("티스토리 발행 이력을 찾을 수 없습니다.");
			});
		} else {
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

	// [Single Thread] : 사용자가 3개의 발행 요청시, 작업이 순차적으로 수행되어 총 48초(16초 * 3)가 소요된다.
	@Override
	public Object postNotionToTistory(List<PostNotionToTistoryDto> PostNotionToTistoryDtoList, Member member) {
		String notionToken = member.getNotionToken();

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
					notionToken,
					member.getToken().getTistoryToken(),
					tistoryPosting.getBlogName(),
					tistoryPosting.getRequestLink(),
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

			// [발행검증]
			tistory.setStatus("발행완료");
		}
		return null;
	}

	public String[] awsLambdaAndTistoryModify(Long postId, String notionToken, PostNotionToTistoryDto tistoryPosting, Member member) throws Exception{
		String title = ""; // Tistory에 게시될 게시글 제목
		String content = ""; // Tistory에 게시될 게시글 내용

		// STEP2-1. AWS Lambda와 통신하는 과정
		lambdaCallFunction = new LambdaCallFunction(
			notionToken,
			member.getToken().getTistoryToken(),
			tistoryPosting.getBlogName(),
			tistoryPosting.getRequestLink(),
			tistoryPosting.getType()
		);
		content = lambdaCallFunction.post();

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> data = objectMapper.readValue(content, Map.class);
		title = (String)data.get("title");
		content = (String)data.get("content");

		// STEP2-2. Tistory API를 이용하여 Tistory 포스팅을 진행한다.
		RestTemplate rt = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("access_token", member.getToken().getTistoryToken());
		params.add("output", "");
		params.add("blogName", tistoryPosting.getBlogName()); // 블로그 이름
		params.add("postId", Long.toString(postId));
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

		// STEP2-3. Tistory API에 요청을 보내고, 응답 결과 중 Response URL을 DB에 반영한다.
		ResponseEntity<String> response = rt.exchange(
			"https://www.tistory.com/apis/post/modify",
			HttpMethod.POST,
			TistoryPostRequest,
			String.class
		);

		String responseString = response.toString(); // Tistory API의 응답
		String[] responseList = new String[2]; // responseLink와 postId를 함께 담아서 보낼 배열
		String responseLink = ""; // Tistory에 게시된 게시글 링크
		String responsePostId = ""; // Tistory에 게시된 게시글 번호
		Document doc = Jsoup.parse(responseString);
		responseLink = doc.select("url").text();
		responsePostId = doc.select("postId").text();

		responseList[0] = responseLink;
		responseList[1] = responsePostId;
		return responseList;
	}

	public String[] awsLambdaAndTistoryPost(String notionToken, PostNotionToTistoryDto tistoryPosting, Member member) {
			String title = ""; // Tistory에 게시될 게시글 제목
			String content = ""; // Tistory에 게시될 게시글 내용

			// STEP2-1. AWS Lambda와 통신하는 과정
			try{
				lambdaCallFunction = new LambdaCallFunction(
					notionToken,
					member.getToken().getTistoryToken(),
					tistoryPosting.getBlogName(),
					tistoryPosting.getRequestLink(),
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
					return null;
				}
			} catch(IOException e){
				e.printStackTrace();
			}

			// STEP2-2. Tistory API를 이용하여 Tistory 포스팅을 진행한다.
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

			// STEP2-3. Tistory API에 요청을 보내고, 응답 결과 중 Response URL을 DB에 반영한다.
			ResponseEntity<String> response = rt.exchange(
				"https://www.tistory.com/apis/post/write",
				HttpMethod.POST,
				TistoryPostRequest,
				String.class
			);

			String responseString = response.toString(); // Tistory API의 응답
			String[] responseList = new String[2]; // responseLink와 postId를 함께 담아서 보낼 배열
			String responseLink = ""; // Tistory에 게시된 게시글 링크
			String postId = ""; // Tistory에 게시된 게시글 번호
			Document doc = Jsoup.parse(responseString);
			responseLink = doc.select("url").text();
			postId = doc.select("postId").text();

			responseList[0] = responseLink;
			responseList[1] = postId;
			return responseList;
	}

	// [Multi Thread] : 사용자가 3개의 발행 요청시, 작업이 동시에 수행되어 총 16초가 소요된다.
	@Override
	public Object postNotionToTistoryMultiThread(List<PostNotionToTistoryDto> PostNotionToTistoryDtoList, Member member) {
		// 초기 스레드 수 : 0, 코어 스레드 수 : 0, 최대 스레드 수 : Integer.MAX_VALUE
		// 추가된 스레드가 60초동안 아무 작업을 수행하지 않으면 ThreadPool에서 제거한다.
		executorService = Executors.newCachedThreadPool();

		// 각 Thread별 실행결과를 반환받는 Future 리스트
		// Future 객체는 다른 스레드들의 연산 결과를 반환받기 위해 사용하는 지연 완료 객체 (Pending Completion Object)이다.
		List<Future<?>> futureList = new ArrayList<>();
		List<Tistory> tistoryList = new ArrayList<>();
		List<String[]> responseLinkList = new ArrayList<>();

		String notionToken = member.getNotionToken();

		for(PostNotionToTistoryDto tistoryPosting : PostNotionToTistoryDtoList){
			if(tistoryPosting.getStatus().equals("발행요청")){
				// STEP1. [발행요청] Tistory 객체 DB 저장
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
				tistoryList.add(tistory);

				// STEP2. [awsLambdaAndTistoryPost] AWS Lambda 호출 및 각 스레드별 FutureList 추가
				Future<?> future = executorService.submit(() -> {
					responseLinkList.add(awsLambdaAndTistoryPost(notionToken, tistoryPosting, member));
				});
				futureList.add(future);
			}
			else if(tistoryPosting.getStatus().equals("수정요청")){
				// Tistory DTO에 ResponseLink가 제공되는 경우만 수정을 진행한다.
				if(!tistoryPosting.getResponseLink().equals("")){
					// STEP1. [수정요청] Tistory 객체 조회
					Tistory tistory = tistoryRepository.findByResponseLink(tistoryPosting.getResponseLink());
					tistory.setRequestLink(tistoryPosting.getRequestLink());
					tistory.setStatus("수정요청");
					tistoryList.add(tistory);

					// STEP2. [awsLambdaAndTistoryModify] AWS Lambda 호출 및 각 스레드별 FutureList 추가
					Future<?> future = executorService.submit(() -> {
						try{
							responseLinkList.add(awsLambdaAndTistoryModify(tistory.getPostId(), notionToken, tistoryPosting, member));
						} catch(HttpClientErrorException e){
							// 티스토리에서 이미 삭제된 게시글에 대해 수정 요청을 하는 경우
							tistory.setStatus("수정실패");
						} catch(JsonParseException e){
							// 입력값이 정상적으로 입력되지 않은 경우
							tistory.setStatus("수정실패");
						} catch(Exception e){
							e.printStackTrace();
							tistory.setStatus("수정실패");
						}
					});
					futureList.add(future);
				}
			}
		}
		System.out.println(executorService);

		// STEP3. ExecutorService 종료 및 모든 스레드의 실행이 종료될 때까지 대기
		try {
			// ThreadPool에 대한 추가적인 Task 제출을 막는다.
			executorService.shutdown();

			// Nano Second 단위로, 현재 실행중인 Task들의 결과가 모두 반환될때까지 대기한다.
			executorService.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		// STEP4. [발행완료|발행실패] Tistory 발행 상태 DB 갱신
		// 각 발행 요청 스레드별 연산 결과를 모두 반환 받을때까지 대기하기 위해, future.get()을 사용한다.
		// 서브 스레드별 연산 결과를 모두 반환 받을때까지 메인 스레드의 실행 흐름을 잠시 Block한다.
		int index = 0;
		for (Future<?> f : futureList) {
			try {
				f.get();
				tistoryList.get(index).setResponseLink(responseLinkList.get(index)[0]);
				tistoryList.get(index).setPostId(Long.parseLong(responseLinkList.get(index)[1]));
				tistoryList.get(index++).setStatus("발행완료");
			} catch (InterruptedException e) {
				e.printStackTrace();
				tistoryList.get(index).setResponseLink(responseLinkList.get(index)[0]);
				tistoryList.get(index).setPostId(Long.parseLong(responseLinkList.get(index)[1]));
				tistoryList.get(index++).setStatus("발행실패");
			} catch (ExecutionException e){
				e.printStackTrace();
				tistoryList.get(index).setResponseLink(responseLinkList.get(index)[0]);
				tistoryList.get(index).setPostId(Long.parseLong(responseLinkList.get(index)[1]));
				tistoryList.get(index++).setStatus("발행실패");
			} catch (IndexOutOfBoundsException e){
				tistoryList.get(index++).setStatus("수정실패");
			}
		}
		return null;
	}

	@Override
	public List<TistoryContentResponseDto> getTistoryContents(Long lastTistoryId, int pageSize) {

		// 무한스크롤 최초 id는 알 수 없으므로 -1을 받아, null로 처리
		if (lastTistoryId == -1) {
			lastTistoryId = null;
		}

		List<Tistory> contents = tistoryRepositoryCust.tistoryPaginationNoOffset(lastTistoryId, pageSize);

		return contents.stream()
			.map(content -> new TistoryContentResponseDto(content))
			.collect(Collectors.toList());
	}
}
