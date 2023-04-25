package me.nogari.nogari.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.aws.LambdaInvokeFunction;
import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.service.ContentServiceImpl;
import me.nogari.nogari.common.JWTDto;
import me.nogari.nogari.common.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@RequestMapping("/contents")
public class ContentController {

	@Autowired
	private ContentServiceImpl contentService;

	@ResponseBody
	@GetMapping("/sort")
	@Operation(summary = "티스토리 발행 내역 리스트 조회")
	public BaseResponse<Object> getTistoryListByFilter(@RequestParam String filter){
		try{
			return BaseResponse.builder()
				.result(contentService.getTistoryList(filter))
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

	@ResponseBody
	@PostMapping("/post")
	@Operation(summary = "노션 게시글 티스토리 발행")
	public BaseResponse<Object> postNotionToTistory(@RequestBody PostNotionToTistoryDto postNotionToTistoryDto){
		try{
			return BaseResponse.builder()
				.result(contentService.postNotionToTistory(postNotionToTistoryDto))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 노션 게시글을 티스토리로 발행했습니다.(지금은 서비스에 AWS Lambda 호출밖에 없어용)")
				.build();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("노션 게시글을 티스토리로 발행하는데 실패했습니다. (지금은 서비스에 AWS Lambda 호출밖에 없어용)")
				.build();
		}
	}
}
