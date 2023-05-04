package me.nogari.nogari.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.nogari.nogari.entity.Tistory;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TistoryContentResponseDto {
	private Long tistoryId;
	private String blogName;
	private String title;
	private String categoryName;
	private Byte visibility;
	private String status;
	private String requestLink;
	private String responseLink;
	private String tagList;
	private String modifiedDate;

	public TistoryContentResponseDto(Tistory tistory) {
		this.tistoryId = tistory.getTistoryId();
		this.modifiedDate = tistory.getModifiedDate();
		this.blogName = tistory.getBlogName();
		this.title = tistory.getTitle();
		this.categoryName = tistory.getCategoryName();
		this.visibility = tistory.getVisibility();
		this.status = tistory.getStatus();
		this.requestLink = tistory.getRequestLink();
		this.responseLink = tistory.getResponseLink();
		this.tagList = tistory.getTagList();
	}
}