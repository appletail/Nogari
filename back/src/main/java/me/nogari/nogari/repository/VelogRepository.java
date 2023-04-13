package me.nogari.nogari.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.nogari.nogari.entity.Velog;

public interface VelogRepository extends JpaRepository<Velog, Long> {
}
