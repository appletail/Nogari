package me.nogari.nogari.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.nogari.nogari.entity.Token;

public interface MemberTokenRepository extends JpaRepository<Token, Long> {

}
