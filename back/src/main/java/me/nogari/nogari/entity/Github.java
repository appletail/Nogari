package me.nogari.nogari.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Github extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "github_id")
	private Long githubId;

	@Column(name = "filename", length = 50)
	private String filename;

	@Column(name = "repository", length = 50)
	private String repository;

	@Column(name = "status", length = 15, nullable = false)
	private String status;
	
	@Column(name = "request_link", length = 300, nullable = false)
	private String requestLink; //요청링크

	@Column(name = "link", length = 300)
	private String link; //발행링크

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Column(name = "sha", length = 300)
	private String sha; //수정코드

	@Column(name = "category_name", length = 50)
	private String categoryName;
}
