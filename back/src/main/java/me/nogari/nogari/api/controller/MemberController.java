package me.nogari.nogari.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.response.SignResponseDto;
import me.nogari.nogari.api.service.MemberService;
import me.nogari.nogari.common.JWTDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;

	@PostMapping("/login")
	public BaseResponse<Object> login(@RequestBody SignRequestDto request) throws Exception {

		return BaseResponse.builder()
			.result(memberService.login(request))
			.resultCode(HttpStatus.OK.value())
			.resultMsg("로그인 성공")
			.build();
	}

	@PostMapping("/signup")
	public BaseResponse<Object> signup(@RequestBody SignRequestDto request) throws Exception {

		try {
			return BaseResponse.builder()
				.result(memberService.signup(request))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("회원가입 성공")
				.build();
		} catch (Exception e) {
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("중복된 id입니다")
				.build();
		}
	}

	@GetMapping("/user/get")
	public ResponseEntity<SignResponseDto> getUser(@RequestParam String id) throws Exception {
		return new ResponseEntity<>(memberService.getMember(id), HttpStatus.OK);
	}

	@GetMapping("/admin/get")
	public ResponseEntity<SignResponseDto> getUserForAdmin(@RequestParam String account) throws Exception {
		return new ResponseEntity<>(memberService.getMember(account), HttpStatus.OK);
	}

	@GetMapping("/duplicate")
	public BaseResponse<Object> checkIdDuplicate(@RequestParam String id) {
		return BaseResponse.builder()
			.result(memberService.checkIdDuplicate(id))
			.resultCode(HttpStatus.OK.value())
			.resultMsg("아이디 중복이면 True")
			.build();
	}

	@GetMapping("/refresh")
	public BaseResponse<Object> refresh(@RequestBody JWTDto jwt) throws Exception {
		return BaseResponse.builder()
			.result(memberService.refreshAccessToken(jwt))
			.resultCode(HttpStatus.OK.value())
			.resultMsg("refresh 토큰이 재발급 되었습니다.")
			.build();
	}
}
