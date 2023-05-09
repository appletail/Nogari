package me.nogari.nogari.api.aws;

import org.springframework.http.HttpEntity;
import org.springframework.util.MultiValueMap;

import me.nogari.nogari.entity.Tistory;

public class LambdaResponse {
	private int index;
	private Tistory tistory;
	private HttpEntity<MultiValueMap<String, String>> tistoryRequest;

	public LambdaResponse() {
		this.index = 0;
		this.tistory = null;
		this.tistoryRequest = null;
	}

	public LambdaResponse(int index, Tistory tistory) {
		this.index = index;
		this.tistory = tistory;
		this.tistoryRequest = null;
	}

	public LambdaResponse(int index, Tistory tistory, HttpEntity<MultiValueMap<String, String>> tistoryRequest) {
		this.index = index;
		this.tistory = tistory;
		this.tistoryRequest = tistoryRequest;
	}

	public Tistory getTistory() {
		return tistory;
	}

	public void setTistory(Tistory tistory) {
		this.tistory = tistory;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public HttpEntity<MultiValueMap<String, String>> getTistoryRequest() {
		return tistoryRequest;
	}

	public void setTistoryRequest(HttpEntity<MultiValueMap<String, String>> tistoryRequest) {
		this.tistoryRequest = tistoryRequest;
	}
}
