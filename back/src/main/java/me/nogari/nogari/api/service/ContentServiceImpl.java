package me.nogari.nogari.api.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.aws.LambdaInvokeFunction;
import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.TistoryCateDto;
import me.nogari.nogari.api.response.TistoryContentResponseDto;
import me.nogari.nogari.api.response.TistoryResponseInterface;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.entity.Tistory;
import me.nogari.nogari.repository.MemberRepository;
import me.nogari.nogari.repository.TistoryRepository;
import me.nogari.nogari.repository.TistoryRepositoryCust;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

	private final MemberRepository memberRepository;

	private final TistoryRepository tistoryRepository;

	private LambdaInvokeFunction lambdaInvokeFunction;

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

					// System.out.println(blogInfoList.toString());

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

	@Override
	public Object postNotionToTistory(List<PostNotionToTistoryDto> PostNotionToTistoryDtoList, Member member) {

		for (PostNotionToTistoryDto tistoryPosting : PostNotionToTistoryDtoList) {

			// AWS와 통신하는 과정
			lambdaInvokeFunction = new LambdaInvokeFunction(
				tistoryPosting.getNotionToken(),
				tistoryPosting.getUrl(),
				tistoryPosting.getType()
			);

			lambdaInvokeFunction.post();

			// 발행상태 확인 필요

			// db 저장
			Tistory tistory = Tistory.builder()
				.blogName(tistoryPosting.getBlogName())
				.requestLink(tistoryPosting.getRequestLink())
				.visibility(tistoryPosting.getVisibility())
				.categoryName(tistoryPosting.getCategoryName())
				.tagList(tistoryPosting.getTagList())
				.status("발행완료")
				.title(tistoryPosting.getTitle())
				.member(member)
				.build();

			tistoryRepository.save(tistory);
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
