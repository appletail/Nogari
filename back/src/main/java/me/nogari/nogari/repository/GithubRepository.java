package me.nogari.nogari.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.nogari.nogari.entity.Github;
import me.nogari.nogari.entity.Tistory;

public interface GithubRepository extends JpaRepository<Github, Long> {
	Github findByGithubId(Long githubId);
}
