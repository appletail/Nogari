package me.nogari.nogari.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import me.nogari.nogari.api.response.TistoryResponseDto;
import me.nogari.nogari.entity.Tistory;

public interface TistoryRepository extends JpaRepository<Tistory, Long> {

	@Modifying
	@Query("select t.requestLink, t.visibility, t.title, t.responseLink, t.categoryName, t.tagList, t.modifiedDate, t.status "
		+ "from Tistory t "
		// + "where t.member = :member "
		+ "order by t.tistoryId desc")
	Optional<List<TistoryResponseDto>> sortTistoryByFilter();
	// Optional<List<TistoryResponseDto>> sortTistoryByFilter(@Param(("member"))Member member);

}
