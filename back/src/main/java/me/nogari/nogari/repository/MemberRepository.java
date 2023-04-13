package me.nogari.nogari.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.nogari.nogari.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
