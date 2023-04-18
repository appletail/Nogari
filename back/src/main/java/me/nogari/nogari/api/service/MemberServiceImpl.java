package me.nogari.nogari.api.service;

import java.util.Collections;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.SignResponseDto;
import me.nogari.nogari.common.JWT;
import me.nogari.nogari.common.JWTDto;
import me.nogari.nogari.common.TokenRepository;
import me.nogari.nogari.common.security.JwtProvider;
import me.nogari.nogari.entity.Authority;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.repository.MemberRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;
	private final TokenRepository tokenRepository;

	@Override
	public SignResponseDto login(SignRequestDto request) {
		Member member = memberRepository.findById(request.getId()).orElseThrow(() ->
			new BadCredentialsException("잘못된 계정정보입니다."));

		if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
			throw new BadCredentialsException("잘못된 계정정보입니다.");
		}

		member.setRefreshToken(createRefreshToken(member));

		return SignResponseDto.builder()
			.memberId(member.getMemberId())
			.id(member.getId())
			.password(member.getPassword())
			.notionToken(member.getNotionToken())
			.roles(member.getRoles())
			.token(JWTDto.builder()
				.access_token(jwtProvider.createToken(member.getId(), member.getRoles()))
				.refresh_token(member.getRefreshToken())
				.build())
			.build();

	}

	@Override
	@Transactional
	public boolean signup(SignRequestDto request) throws Exception {
		try {
			Member member = Member.builder()
				.id(request.getId())
				.password(passwordEncoder.encode(request.getPassword()))
				.notionToken(request.getNotionToken())
				.build();

			member.setRoles(Collections.singletonList(Authority.builder().name("ROLE_USER").build()));

			memberRepository.save(member);
		} catch (Exception e) {
			throw new Exception("잘못된 요청입니다.");
		}
		return true;
	}

	@Override
	public SignResponseDto getMember(String id) throws Exception {
		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new Exception("계정을 찾을 수 없습니다."));
		return new SignResponseDto(member);
	}

	@Override
	public boolean checkIdDuplicate(String id) {
		return memberRepository.existsById(id);
	}

	// Refresh Token ================

	/**
	 * Refresh 토큰을 생성한다.
	 * Redis 내부에는
	 * refreshToken:memberId : tokenValue
	 * 형태로 저장한다.
	 */
	public String createRefreshToken(Member member) {
		JWT jwt = tokenRepository.save(
			JWT.builder()
				.id(member.getMemberId())
				.refresh_token(UUID.randomUUID().toString())
				.expiration(120)
				.build()
		);
		return jwt.getRefresh_token();
	}

	public JWT validRefreshToken(Member member, String refreshToken) throws Exception {
		JWT jwt = tokenRepository.findById(member.getMemberId())
			.orElseThrow(() -> new Exception("만료된 계정입니다. 로그인을 다시 시도하세요"));
		// 해당유저의 Refresh 토큰 만료 : Redis에 해당 유저의 토큰이 존재하지 않음
		if (jwt.getRefresh_token() == null) {
			return null;
		} else {
			// 리프레시 토큰 만료일자가 얼마 남지 않았을 때 만료시간 연장..?
			if (jwt.getExpiration() < 10) {
				jwt.setExpiration(1000);
				tokenRepository.save(jwt);
			}

			// 토큰이 같은지 비교
			if (!jwt.getRefresh_token().equals(refreshToken)) {
				return null;
			} else {
				return jwt;
			}
		}
	}

	public JWTDto refreshAccessToken(JWTDto token) throws Exception {
		String id = jwtProvider.getId(token.getAccess_token());
		Member member = memberRepository.findById(id).orElseThrow(() ->
			new BadCredentialsException("잘못된 계정정보입니다."));
		JWT refreshToken = validRefreshToken(member, token.getRefresh_token());

		if (refreshToken != null) {
			return JWTDto.builder()
				.access_token(jwtProvider.createToken(id, member.getRoles()))
				.refresh_token(refreshToken.getRefresh_token())
				.build();
		} else {
			throw new Exception("로그인을 해주세요");
		}
	}
}