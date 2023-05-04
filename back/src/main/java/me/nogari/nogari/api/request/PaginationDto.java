package me.nogari.nogari.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationDto {

	private Long lastTistoryId;
	private int pageSize;
	// 정렬
	private String filter;
	// 검색
	private String word;

}
