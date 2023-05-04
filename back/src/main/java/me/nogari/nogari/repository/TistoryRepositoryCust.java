package me.nogari.nogari.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.entity.QTistory;
import me.nogari.nogari.entity.Tistory;

@RequiredArgsConstructor
@Repository
public class TistoryRepositoryCust {

	private final JPAQueryFactory query;
	QTistory tistory = QTistory.tistory;

	public List<Tistory> tistoryPaginationNoOffset(Long lastTistoryId, int pageSize) {

		return query
			.select(tistory)
			.from(tistory)
			.where(
				ltTistoryId(lastTistoryId)   // 마지막 id보다 작은 것들 중
			)
			.orderBy(tistory.createdDate.desc())
			.limit(pageSize)            // 조회할 size
			.fetch();
	}

	// 마지막으로 조회된 Id보다 작은 값들을 선택하는 조건
	private BooleanExpression ltTistoryId(Long lastTistoryId) {
		if (lastTistoryId == null) {
			return null; // BooleanExpression 자리에 null이 반환되면 조건문에서 자동으로 제거된다
		}

		return tistory.tistoryId.lt(lastTistoryId);
	}
}