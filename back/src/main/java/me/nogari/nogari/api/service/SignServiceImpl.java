package me.nogari.nogari.api.service;

import java.util.Collections;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.SignResponseDto;
import me.nogari.nogari.common.security.JwtProvider;
import me.nogari.nogari.entity.Authority;
import me.nogari.nogari.entity.Member;
import me.nogari.nogari.repository.MemberRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class SignServiceImpl implements SignService {
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;

	@Override
	public SignResponseDto login(SignRequestDto request) throws Exception {
		Member member = memberRepository.findById(request.getId()).orElseThrow(() ->
			new BadCredentialsException("잘못된 계정정보입니다."));

		if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
			throw new BadCredentialsException("잘못된 계정정보입니다.");
		}

		return SignResponseDto.builder()
			.memberId(member.getMemberId())
			.id(member.getId())
			.password(member.getPassword())
			.roles(member.getRoles())
			.token(jwtProvider.createToken(member.getId(), member.getRoles()))
			.build();

	}

	@Override
	@Transactional
	public boolean register(SignRequestDto request) throws Exception {
		try {
			Member member = Member.builder()
				.memberId(request.getMemberId())
				.id(request.getId())
				.password(passwordEncoder.encode(request.getPassword()))
				.build();

			member.setRoles(Collections.singletonList(Authority.builder().name("ROLE_USER").build()));

			memberRepository.save(member);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new Exception("잘못된 요청입니다.");
		}
		return true;
	}

	@Override
	public SignResponseDto getMember(String Id) throws Exception {
		Member member = memberRepository.findById(Id)
			.orElseThrow(() -> new Exception("계정을 찾을 수 없습니다."));
		return new SignResponseDto(member);
	}
}