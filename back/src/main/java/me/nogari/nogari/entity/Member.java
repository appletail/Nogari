package me.nogari.nogari.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Long memberId;

	@Column(name = "id", nullable = false, length = 40)
	private String id;

	@Column(name = "password", nullable = false, length = 40)
	@JsonIgnore
	@ToString.Exclude
	private String password;

	@Column(name = "notionToken", nullable = false)
	private String notionToken;

	@Builder.Default
	@OneToMany(mappedBy = "member")
	private List<Tistory> tistorys = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "member")
	private List<Velog> velogs = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "member")
	private List<Github> githubs = new ArrayList<>();

}