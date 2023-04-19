package me.nogari.nogari.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Long memberId;

	@Column(name = "email", unique = true, nullable = false, length = 50)
	private String email;

	@Column(name = "password", nullable = false)
	@JsonIgnore
	@ToString.Exclude
	private String password;

	@Column(name = "notionToken")
	private String notionToken;

	@Column(name = "refreshToken")
	private String refreshToken;

	@OneToMany(mappedBy = "member", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@Builder.Default
	private List<Authority> roles = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "member")
	private List<Tistory> tistorys = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "member")
	private List<Github> githubs = new ArrayList<>();

	public void setRoles(List<Authority> role) {
		this.roles = role;
		role.forEach(o -> o.setMember(this));
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
}