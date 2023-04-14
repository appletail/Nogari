package me.nogari.nogari.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/oauth")
@Tag(name = "OAuthController", description = "플랫폼 인증 서비스")
public class OAuthController {

	@ResponseBody
	@GetMapping("/kakao")
	public void kakaoCallBack(@RequestParam String code){
		// 카카오 인가코드 받기
		System.out.println("code: " + code);

		// 카카오 서버에 인가토큰 (access token) 받기

	}

}
