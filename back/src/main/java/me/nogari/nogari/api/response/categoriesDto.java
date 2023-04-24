package me.nogari.nogari.api.response;

import org.springframework.core.SpringVersion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class categoriesDto {

	private String id;
	private String name;
	private String parent;
	private String label;
	private String entries;

}
