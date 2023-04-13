package me.nogari.nogari.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.nogari.nogari.entity.Github;

public interface GithubRepository extends JpaRepository<Github, Long> {
}
