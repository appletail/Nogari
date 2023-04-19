package me.nogari.nogari.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.service.ContentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/contents")
public class ContentController {

	private final ContentService contentService;

	@GetMapping("/tistory")
	public BaseResponse<Object> getTistoryContents(@RequestParam Long lastTistoryId, @RequestParam int pageSize) {

		return BaseResponse.builder()
			.result(contentService.getTistoryContents(lastTistoryId, pageSize))
			.resultCode(HttpStatus.OK.value())
			.resultMsg("무한스크롤 조회 성공")
			.build();
	}
}
