package me.nogari.nogari.api.service;

import org.springframework.stereotype.Service;

import me.nogari.nogari.api.response.OAuthAccessTokenResponse;

@Service
public interface OauthService {

	String getKakaoAccessToken(String code);

	OAuthAccessTokenResponse getGithubAccessToken(String code);

	OAuthAccessTokenResponse getNotionAccessToken(String code);
}
