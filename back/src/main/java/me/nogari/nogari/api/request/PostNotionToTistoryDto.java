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
	// AWS Lambda
	private String url;
	private String type;

	// Tistory
	private String blogName;
	private String requestLink;
	private Byte visibility;
	private String categoryName;
	private String tagList;
	private String status;
	private String title;

}
