package me.nogari.nogari.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

/**
 * Swagger springdoc-ui 구성 파일
 */
@Configuration
@EnableWebMvc
public class SwaggerConfig {
	@Bean
	public OpenAPI openAPI() {
		Info info = new Info()
			.title("Nogari API Document")
			.version("v1.0.0")
			.description("SSAFY 자율 프로젝트 Nogari의 API 명세서입니다.");
		return new OpenAPI()
			.addServersItem(new Server().url("http://localhost:8080/api/v1"))
			.components(new Components())
			.info(info);
	}
}