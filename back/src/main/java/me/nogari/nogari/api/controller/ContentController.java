package me.nogari.nogari.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.service.ContentServiceImpl;
import me.nogari.nogari.common.JWTDto;
import me.nogari.nogari.common.security.CustomUserDetails;
import me.nogari.nogari.entity.Member;

@RestController
@RequiredArgsConstructor
@RequestMapping("/contents")
public class ContentController {

	@Autowired
	private ContentServiceImpl contentService;

	@ResponseBody
	@GetMapping("/sort")
	@Operation(summary = "티스토리 발행 내역 리스트 조회")
	public BaseResponse<Object> getTistoryListByFilter(@RequestParam String filter,
		@AuthenticationPrincipal CustomUserDetails customUserDetails ){

		// security session에 있는 유저 정보를 가져온다
		Member member;
		try{
			// member = Optional.ofNullable(customUserDetails.getMember());
			member = customUserDetails.getMember();
			// System.out.println(member.getToken().getTistoryToken());
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("로그인된 사용자가 없습니다!")
				.build();
		}

		try{
			return BaseResponse.builder()
				.result(contentService.getTistoryList(filter, member))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 티스토리 발행 내역 조회 성공")
				.build();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("티스토리 발행 내역 조회 실패")
				.build();

		}
	}
}
