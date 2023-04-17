package me.nogari.nogari.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.service.OauthServiceImpl;

@RestController
@AllArgsConstructor
@RequestMapping("/oauth")
@Tag(name = "OAuthController", description = "플랫폼 인증 서비스")
public class OAuthController {

	@Autowired
	private OauthServiceImpl oauthService;

	// @ResponseBody
	// @GetMapping
	// public BaseResponse<Object> test(){
	//
	// }

	@ResponseBody
	@GetMapping("/kakao")
	public BaseResponse<Object> kakaoCallBack(@RequestParam String code){
		// 카카오 인가코드 받기
		// System.out.println("code: " + code);

		// 카카오 서버에 엑세스토큰 (access token) 받기
		try{
			return BaseResponse.builder()
				.result(oauthService.getKakaoAccessToken(code))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 카카오 엑세스 토근 얻기 성공")
				.build();
		}catch (Exception e){
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("카카오 엑세스 토큰 얻기에 실패")
				.build();

		}
	}

}