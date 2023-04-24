package me.nogari.nogari.api.controller;

import java.util.List;

import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
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
	@GetMapping("/github")
	@Operation(summary = "github 포스팅")
	public BaseResponse<Object> publishGithub(){
		String ATK = "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";

		try{
			GitHub gitHub = new GitHubBuilder().withOAuthToken(ATK).build();
			System.out.println("github 생성 성공 : " + gitHub);

			return BaseResponse.builder()
				.result(contentService.githubConnectionTest(gitHub))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 성공")
				.build();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("github 생성 실패")
				.build();
		}
	}
}
