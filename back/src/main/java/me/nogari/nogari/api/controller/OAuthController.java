package me.nogari.nogari.api.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.response.OAuthAccessTokenResponse;
import me.nogari.nogari.api.service.OauthServiceImpl;
import me.nogari.nogari.common.security.CustomUserDetails;
import me.nogari.nogari.entity.Member;

@RestController
@AllArgsConstructor
@RequestMapping("/oauth")
@Tag(name = "OAuthController", description = "플랫폼 인증 서비스")
public class OAuthController {

	@Autowired
	private OauthServiceImpl oauthService;

	@ResponseBody
	@GetMapping("/kakao")
	@Operation(summary = "카카오(티스토리) 토큰 발급")
	public BaseResponse<Object> kakaoCallBack(@RequestParam String code,
		@AuthenticationPrincipal CustomUserDetails customUserDetails ){

		// security session에 있는 유저 정보를 가져온다
		Optional<Member> member;
		try{
			member = Optional.ofNullable(customUserDetails.getMember());
		}catch (Exception e){
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("로그인된 사용자가 없습니다.")
				.build();
		}

		// 카카오 인가코드 받기
		// System.out.println("code: " + code);

		// 카카오 서버에 엑세스토큰 (access token) 받기
		try{
			return BaseResponse.builder()
				.result(oauthService.getKakaoAccessToken(code, member.get()))
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

	@ResponseBody
	@GetMapping("/git")
	@Operation(summary = "깃허브 토큰 발급")
	public BaseResponse<Object> getGithubAccessToken(@RequestParam String code){
		// 깃허브 인가코드 받기
		System.out.println("code: " + code);

		// 깃허브 서버에 엑세스토큰 (access token) 받기
		try{
			OAuthAccessTokenResponse tokenResponse = oauthService.getGithubAccessToken(code);
			String ATK= tokenResponse.getAccessToken();
			System.out.println("ATK : " + ATK);
			return BaseResponse.builder()
				.result(ATK)
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 깃허브 엑세스 토근 얻기 성공")
				.build();
		}catch (Exception e){
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("깃허브 엑세스 토큰 얻기에 실패")
				.build();
		}
	}
	@ResponseBody
	@GetMapping("/notion")
	@Operation(summary = "노션 토큰 발급")
	public BaseResponse<Object> getNotionAccessToken(@RequestParam String code){
		// 깃허브 인가코드 받기
		System.out.println("notion code: " + code);

		// 깃허브 서버에 엑세스토큰 (access token) 받기
		try{
			String ATK =oauthService.getNotionAccessToken(code);
			System.out.println("ATK : " + ATK);
			return BaseResponse.builder()
				.result(ATK)
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 노션 엑세스 토근 얻기 성공")
				.build();
		}catch (Exception e){
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("노션 엑세스 토큰 얻기에 실패")
				.build();
		}
	}
}
