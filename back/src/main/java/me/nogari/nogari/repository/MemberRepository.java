package me.nogari.nogari.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import me.nogari.nogari.entity.Member;

@Transactional
public interface MemberRepository extends JpaRepository<Member, Long> {
	Optional<Member> findById(String id);
}
