package me.nogari.nogari.api.service;

import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.SignResponseDto;

public interface MemberService {
	SignResponseDto login(SignRequestDto request);

	boolean signup(SignRequestDto request) throws Exception;

	SignResponseDto getMember(String account) throws Exception;

	boolean checkIdDuplicate(String id);
}
