package me.nogari.nogari.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostNotionToTistoryDto {
	// aws lambda 연결 위해
	private String notionToken;
	private String url;
	private String type;

	// tistory 글 발행 위해
	private String blogName;
	private String requestLink;
	private Byte visibility;
	private String categoryName;
	private String tagList;
	private String status;
	private String title;

}
