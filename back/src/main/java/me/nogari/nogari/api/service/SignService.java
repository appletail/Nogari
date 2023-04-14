package me.nogari.nogari.api.service;

import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.SignResponseDto;

public interface SignService {
	SignResponseDto login(SignRequestDto request) throws Exception;

	boolean register(SignRequestDto request) throws Exception;

	SignResponseDto getMember(String account) throws Exception;
}
