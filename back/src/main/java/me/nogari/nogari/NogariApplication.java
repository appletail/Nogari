package me.nogari.nogari;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class NogariApplication {

	public static void main(String[] args) {
		SpringApplication.run(NogariApplication.class, args);
	}

}
