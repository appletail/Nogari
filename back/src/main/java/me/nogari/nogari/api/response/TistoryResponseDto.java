package me.nogari.nogari.api.response;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Tistory Response DTO")
public class TistoryResponseDto {

	private String requestLink;
	private Byte visibility;
	private String title;
	private String responseLink;
	private String categoryName;

	// ,(쉼포)로 구분
	private String tagList;
	private LocalDateTime modifiedDate;

	// 발행요청, 발행완료, 수정요청,접근불가, 기타오류
	private String status;

}
