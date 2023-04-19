package me.nogari.nogari.api.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.response.TistoryContentResponseDto;
import me.nogari.nogari.entity.Tistory;
import me.nogari.nogari.repository.TistoryRepositoryCust;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

	private final TistoryRepositoryCust tistoryRepositoryCust;

	@Override
	public List<TistoryContentResponseDto> getTistoryContents(Long lastTistoryId, int pageSize) {

		// 무한스크롤 최초 id는 알 수 없으므로 -1을 받아, null로 처리
		if (lastTistoryId == -1) {
			lastTistoryId = null;
		}

		List<Tistory> contents = tistoryRepositoryCust.tistoryPaginationNoOffset(lastTistoryId, pageSize);

		return contents.stream()
			.map(content -> new TistoryContentResponseDto(content))
			.collect(Collectors.toList());
	}
}
