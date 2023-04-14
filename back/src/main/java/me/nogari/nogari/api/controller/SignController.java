package me.nogari.nogari.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.request.SignRequestDto;
import me.nogari.nogari.api.response.SignResponseDto;
import me.nogari.nogari.api.service.SignService;

@RestController
@RequiredArgsConstructor
public class SignController {

	private final SignService signService;

	@PostMapping(value = "/login")
	public ResponseEntity<SignResponseDto> login(@RequestBody SignRequestDto request) throws Exception {
		return new ResponseEntity<>(signService.login(request), HttpStatus.OK);
	}

	@PostMapping(value = "/register")
	public ResponseEntity<Boolean> signup(@RequestBody SignRequestDto request) throws Exception {
		return new ResponseEntity<>(signService.register(request), HttpStatus.OK);
	}

	@GetMapping("/user/get")
	public ResponseEntity<SignResponseDto> getUser(@RequestParam String account) throws Exception {
		return new ResponseEntity<>(signService.getMember(account), HttpStatus.OK);
	}

	@GetMapping("/admin/get")
	public ResponseEntity<SignResponseDto> getUserForAdmin(@RequestParam String account) throws Exception {
		return new ResponseEntity<>(signService.getMember(account), HttpStatus.OK);
	}
}
