package me.nogari.nogari.api.aws;

import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Callable;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;

import me.nogari.nogari.api.request.PostNotionToGithubDto;
import me.nogari.nogari.entity.Github;
import me.nogari.nogari.entity.Member;


public class awsLambdaCallableGithub implements Callable<LambdaResponse> {
	private LambdaCallFunction lambdaCallFunction;

	private int index;
	private PostNotionToGithubDto post;
	private Github github;
	private Member member;

	public awsLambdaCallableGithub(int index, PostNotionToGithubDto post, Github github, Member member) {
		this.index = index;
		this.post = post;
		this.github = github;
		this.member = member;
	}

	public LambdaResponse githubAwsLambda(int index, PostNotionToGithubDto post, Github github,
		Member member) throws Exception {
		LambdaResponse lambdaResponse = new LambdaResponse(index, github);

		// STEP2-1. AWS Lambda와 통신하는 과정
		Map<String, Object> data = awsLambdaResponse(post, member);
		String title = (String)data.get("title"); // github에 게시될 게시글 제목
		String content = (String)data.get("content"); // github에 게시될 게시글 내용
		
		//filePath 생성
		String filePath = member.getGithubId() + "/" + post.getRepository() + "/contents/" +post.getCategoryName() +"/"+ title + "_" + fileDate + "."+ post.getType();
		System.out.println("githubAwsLambda filePath : " +  filePath );

		// STEP2-2. Tistory API를 이용하여 Tistory 포스팅을 진행하기 위해 HttpEntity를 구성한다.
		HttpEntity<Map<String, String>> httpGithubRequest = getHttpLambdaRequest(title, content, github,
			post, member);
		lambdaResponse.setGithubRequest(httpGithubRequest);

		return lambdaResponse;
	}

	// STEP2-1. AWS Lambda와 통신하여 JSON 응답값을 받아오는 메소드
	public Map<String, Object> awsLambdaResponse(PostNotionToGithubDto post, Member member) throws Exception {
		String response = ""; // Tistory에 발행할 Notion 페이지를 md로 파싱한 JSON 응답값

		// STEP2-1-1. AWS Lambda와 통신하는 과정
		lambdaCallFunction = new LambdaCallFunction(
			member.getNotionToken(),
			member.getToken().getGithubToken(),
			post.getRepository(),
			post.getRequestLink(),
			post.getType()
		);
		response = lambdaCallFunction.gitPost();

		// STEP2-1-2. JSON 데이터로 구성된 파싱 결과를 형식에 맞게 읽어들인다.
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> data = objectMapper.readValue(response, Map.class);

		return data;
	}

	// STEP2-2. Github API를 이용하여 Github 포스팅을 진행하기 위해 HttpEntity를 구성하는 메소드
	public HttpEntity<Map<String, String>> getHttpLambdaRequest(
		String title, String content, Github github, PostNotionToGithubDto post, Member member) {

		HttpHeaders headers = new HttpHeaders();

		//파일명 중복 방지를 위한 현재 날짜, 시간
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
		Date nowDate = new Date();
		String fileDate = simpleDateFormat.format(nowDate);
		System.out.println("upload filedate : " + fileDate);

		headers.add("Accept", "application/vnd.github+json");
		headers.add("Authorization", "Bearer " + member.getToken().getGithubToken());
		headers.add("X-GitHub-Api-Version", "2022-11-28");
		headers.setContentType(MediaType.APPLICATION_JSON);

		String fileContent = Base64.getEncoder().encodeToString(content.getBytes());

		Map<String, String> body = new LinkedHashMap<>();
		body.put("message", title);
		body.put("content", fileContent);
		if (github.getStatus().equals("수정요청")) {
			body.put("sha", github.getSha());
		}
		HttpEntity<Map<String, String>> httpLambdaRequest = new HttpEntity<>(body, headers);


		return httpLambdaRequest;
	}

	@Override
	public LambdaResponse call() throws Exception {
		return githubAwsLambda(index, post, github, member);
	}
}
