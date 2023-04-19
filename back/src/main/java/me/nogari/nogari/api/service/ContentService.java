package me.nogari.nogari.api.service;

import java.util.List;

import me.nogari.nogari.api.response.TistoryContentResponseDto;

public interface ContentService {

	List<TistoryContentResponseDto> getTistoryContents(Long lastTistoryId, int pageSize);

}
