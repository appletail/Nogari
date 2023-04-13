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
public class Velog extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "velog_id")
	private Long velogId;

	@Column(name = "title", length = 50)
	private String title;

	@Column(name = "category", length = 50)
	private String category;

	@Column(name = "status", length = 15, nullable = false)
	private String status;

	@Column(name = "link", length = 300)
	private String link;

	// @Builder.Default
	// @OneToMany(mappedBy = "velog")
	// private List<VelogTag> tags = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;
}
