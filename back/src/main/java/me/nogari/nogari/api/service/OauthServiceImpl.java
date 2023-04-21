package me.nogari.nogari.api.service;

import com.google.gson.JsonParser;
import com.google.gson.JsonElement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.nogari.nogari.api.response.OAuthAccessTokenResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class OauthServiceImpl implements OauthService {
	private static final RestTemplate restTemplate = new RestTemplate();
	@Value("${app.auth.kakao.restapi-key}") private String REST_API_KEY;
	@Value("${app.auth.kakao.redirect-uri}") private String REDIRECT_URI;
	@Value("${app.auth.github.redirect-uri}") private String ACCESS_TOKEN_URL;
	@Value("${app.auth.github.client-id}") private String CLIENT_ID;
	@Value("${app.auth.github.client-secret}") private String CLIENT_SECRET;

	@Override
	public String getKakaoAccessToken(String code) {

		String access_Token = "";
		String reqURL = "https://kauth.kakao.com/oauth/token";

		try {
			URL url = new URL(reqURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			//POST 요청을 위해 기본값이 false인 setDoOutput을 true로
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);

			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
			StringBuilder sb = new StringBuilder();
			sb.append("grant_type=authorization_code");
			sb.append("&client_id=" + REST_API_KEY);
			sb.append("&redirect_uri=" + REDIRECT_URI);
			sb.append("&code=" + code);
			bw.write(sb.toString());
			bw.flush();

			int responseCode = conn.getResponseCode();

			//요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			String line = "";
			String result = "";

			while ((line = br.readLine()) != null) {
				result += line;
			}
			JsonParser parser = new JsonParser();
			JsonElement element = parser.parse(result);

			access_Token = element.getAsJsonObject().get("access_token").getAsString();

			br.close();
			bw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return access_Token;
	}

	@Override
	public OAuthAccessTokenResponse getGithubAccessToken(String code) {
		ResponseEntity<OAuthAccessTokenResponse> response = restTemplate.exchange("https://github.com/login/oauth/access_token",
			HttpMethod.POST,
			getGitHubParams(code),
			OAuthAccessTokenResponse.class);
		String accessToken = response.getBody().getAccessToken();
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
	public OAuthAccessTokenResponse getNotionAccessToken(String code) {
		ResponseEntity<OAuthAccessTokenResponse> response = restTemplate.exchange("https://api.notion.com/v1/oauth/token",
			HttpMethod.POST,
			getGitHubParams(code),
			OAuthAccessTokenResponse.class);
		String accessToken = response.getBody().getAccessToken();
		return response.getBody();
	}

}
