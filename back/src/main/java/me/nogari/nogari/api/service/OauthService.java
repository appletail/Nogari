package me.nogari.nogari.api.service;

import org.springframework.stereotype.Service;

@Service
public interface OauthService {

	String getKakaoAccessToken(String code);

}
