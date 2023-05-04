package me.nogari.nogari.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.nogari.nogari.api.response.KakaoAccessTokenResponse;
import me.nogari.nogari.api.response.NotionAccessTokenResponse;
import me.nogari.nogari.api.response.OAuthAccessTokenResponse;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.entity.Token;
import me.nogari.nogari.repository.MemberRepository;
import me.nogari.nogari.repository.MemberTokenRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class OauthServiceImpl implements OauthService {
	private static final RestTemplate restTemplate = new RestTemplate();
	@Value("${app.auth.tistory.kakao}") private String KAKAO_RESTAPI;
	@Value("${app.auth.tistory.client-id}") private String TISTORY_CLIENT_ID;
	@Value("${app.auth.tistory.client-secret}") private String TISTORY_CLIENT_SECRETKEY;
	@Value("${app.auth.kakao.redirect-uri}") private String REDIRECT_URI;
	@Value("${app.auth.github.redirect-uri}") private String ACCESS_TOKEN_URL;
	@Value("${app.auth.github.client-id}") private String CLIENT_ID;
	@Value("${app.auth.github.client-secret}") private String CLIENT_SECRET;
	@Value("${app.auth.notion.oauth-client-id}") private String NOTION_CLIENT_ID;
	@Value("${app.auth.notion.oauth-client-secret}") private String NOTION_CLIENT_SECRET;

	private final MemberTokenRepository memberTokenRepository;
	private final MemberRepository memberRepository;

	@Override
	@Transactional
	public String getTistoryAccessToken(String code, Member member) {

		String accessToken = "";
		RestTemplate rt = new RestTemplate();

		ResponseEntity<Object> response = rt.exchange(
			"https://www.tistory.com/oauth/access_token?"
				+ "client_id="
				+ TISTORY_CLIENT_ID
				+ "&"
				+ "client_secret="
				+ TISTORY_CLIENT_SECRETKEY
				+ "&"
				+ "redirect_uri=http://localhost:3000/oauth/tistory"
				+ "&"
				+ "code="+code
				+ "&"
				+ "grant_type=authorization_code",
			HttpMethod.GET,
			null,
			Object.class
		);
		System.out.println("response: "+response);

		accessToken = response.getBody().toString().split("=")[1];
		accessToken = accessToken.split("}")[0];

		// System.out.println(accessToken);

		Token token = memberTokenRepository.findById(member.getToken().getTokenId()).orElseThrow(
		    () -> new IllegalArgumentException()
		);
		token.setTistoryToken(accessToken);

		return accessToken;
	}

	@Override
	@Transactional
	public String getKakaoAccessToken(String code, Member member) {

		String accessToken = "";
		RestTemplate rt = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", KAKAO_RESTAPI);
		// params.add("redirect_uri", REDIRECT_URI);
		params.add("code", code);

		HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

		ResponseEntity<KakaoAccessTokenResponse> response = rt.exchange(
			"https://kauth.kakao.com/oauth/token",
			HttpMethod.POST,
			kakaoTokenRequest,
			KakaoAccessTokenResponse.class
		);

		accessToken= response.getBody().getAccess_token();

		Token token = memberTokenRepository.findById(member.getToken().getTokenId()).orElseThrow(
			() -> new IllegalArgumentException()
		);

		token.setTistoryToken(accessToken);

		return accessToken;
	}

	@Override
	@Transactional
	public OAuthAccessTokenResponse getGithubAccessToken(String code, Member member) {
		ResponseEntity<OAuthAccessTokenResponse> response = restTemplate.exchange("https://github.com/login/oauth/access_token",
			HttpMethod.POST,
			getGitHubParams(code),
			OAuthAccessTokenResponse.class);
		String accessToken = response.getBody().getAccessToken();

		System.out.println("github response.getBody().getAccessToken() : " + response.getBody().getAccessToken());
		System.out.println("github bot : "  +response.getBody().getBot_id());

		System.out.println(response.getBody().getWorkspace_name());

		String ATK = response.getBody().getAccessToken();

		Token token = memberTokenRepository.findById(member.getToken().getTokenId()).orElseThrow(
			() -> new IllegalArgumentException()
		);
		token.setGithubToken(ATK);
		// memberTokenRepository.save(tokenInfo);
		return response.getBody();
	}

	private HttpEntity<MultiValueMap<String,String>> getGitHubParams(String code) {
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("client_id",CLIENT_ID);
		params.add("client_secret",CLIENT_SECRET);
		params.add("code",code);

		HttpHeaders headers = new HttpHeaders();
		return new HttpEntity<>(params,headers);
	}

	@Override
	@Transactional
	public String getNotionAccessToken(String code, Member member) {
		HttpHeaders headers = new HttpHeaders();
		//NOTION_CLIENT_ID, NOTION_CLIENT_SECRET를 base64 인코딩해서 요청 	헤더에 넣어야함
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.setBasicAuth(NOTION_CLIENT_ID, NOTION_CLIENT_SECRET);

		MultiValueMap<String, String> params= new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("code", code);
		params.add("redirect_uri", "https://k8c206.p.ssafy.io/oauth/notion");

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		ResponseEntity<NotionAccessTokenResponse> response = restTemplate.postForEntity(
			"https://api.notion.com/v1/oauth/token",
			request,
			NotionAccessTokenResponse.class
		);

		String ATK = response.getBody().getAccess_token();

		Member user = memberRepository.findById(member.getMemberId()).orElseThrow(
			() -> new IllegalArgumentException()
		);

		user.setNotionToken(ATK);

		return response.getBody().getAccess_token();
	}

}
