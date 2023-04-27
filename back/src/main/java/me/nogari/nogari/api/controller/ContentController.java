package me.nogari.nogari.api.controller;

import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.RefSpec;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.RepositoryService;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import me.nogari.nogari.api.request.PostNotionToTistoryDto;
import me.nogari.nogari.api.response.BaseResponse;
import me.nogari.nogari.api.service.ContentServiceImpl;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import me.nogari.nogari.common.security.CustomUserDetails;
import me.nogari.nogari.entity.Member;


@RestController
@RequiredArgsConstructor
@RequestMapping("/contents")
public class ContentController {
	@Autowired
	private ContentServiceImpl contentService;

	@ResponseBody
	@GetMapping("/sort")
	@Operation(summary = "티스토리 발행 내역 리스트 조회")
	public BaseResponse<Object> getTistoryListByFilter(@RequestParam String filter,
		@AuthenticationPrincipal CustomUserDetails customUserDetails ){

		// security session에 있는 유저 정보를 가져온다
		Member member;
		try{
			member = customUserDetails.getMember();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("로그인된 사용자가 없습니다!")
				.build();
		}

		try{
			return BaseResponse.builder()
				.result(contentService.getTistoryList(filter, member))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 티스토리 발행 내역 조회 성공")
				.build();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("티스토리 발행 내역 조회 실패")
				.build();

		}
	}
	@ResponseBody
	@GetMapping("/git/clone")
	@Operation(summary = "github repository clone")
	public void gitCloneRepo() throws GitAPIException, IOException {
		String ATK = "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";

		//create git folder
		File gitDir = new File("C:\\nogari-git-test\\git-clone-test");
		if(gitDir.exists()){
			FileUtils.deleteDirectory(gitDir);
		}

		if(gitDir.mkdirs()){
			System.out.println("dir create success");
		}

		//set username, access token
		CredentialsProvider credentialsProvider
				= new UsernamePasswordCredentialsProvider(
				"dnflrhkddyd@naver.com"
				, ATK); //access token

		//clone
		Git git = Git.cloneRepository()
				.setURI("https://github.com/encoreKwang/PullRequestTest")
				.setCredentialsProvider(credentialsProvider)
				.setDirectory(gitDir)
				.call();
		git.close();

//		contentService.githubConnectionTest();

	}
	@ResponseBody
	@GetMapping("/git/add")
	@Operation(summary = "github add")
	public void gitAdd() throws GitAPIException, IOException {
		//git repo path
		String dirPath = "C:\\nogari-git-test\\git-clone-test";
		File gitDir = new File(dirPath);

		//create temp file
		String fileName = UUID.randomUUID().toString();
		File file = new File(dirPath+"\\"+fileName+".txt");
		FileUtils.writeStringToFile(file, "testing it...", StandardCharsets.UTF_8);

		//add
		Git git = Git.open(gitDir);

		AddCommand add = git.add();
		add.addFilepattern(fileName+".txt").call();

		git.close();
	}
	@ResponseBody
	@GetMapping("/git/commit")
	@Operation(summary = "github commit")
	public void gitCommit() throws GitAPIException, IOException {
		//git repo path
		String dirPath = "C:\\nogari-git-test\\git-clone-test";
		File gitDir = new File(dirPath);

		//commit
		Git git = Git.open(gitDir);
		git.commit().setMessage("JGIT commit test").call();

		git.close();
	}
	@ResponseBody
	@GetMapping("/git/push")
	@Operation(summary = "github push")
	public void gitPush() throws GitAPIException, IOException {
		String ATK = "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";

		//git repo path
		String dirPath = "C:\\nogari-git-test\\git-clone-test";
		File gitDir = new File(dirPath);

		//set username, access token
		CredentialsProvider credentialsProvider
				= new UsernamePasswordCredentialsProvider(
				"dnflrhkddyd@naver.com"
				, ATK); //access token

		//push
		Git git = Git.open(gitDir);
		git.push()
				.setCredentialsProvider(credentialsProvider)
				.setRemote("origin")
				.setRefSpecs(new RefSpec("master"))
				.call();

		git.close();
	}

	@ResponseBody
	@GetMapping("/git/repoList")
	@Operation(summary = "get github repo list")
	public List<Repository> gitRepoList() throws GitAPIException, IOException {
		// Create a GitHub client and set the access token
		String ATK = "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";

		GitHubClient client = new GitHubClient();
		client.setOAuth2Token(ATK);

		// RepositoryService 생성
		RepositoryService repoService = new RepositoryService(client);

		// 유저의 repositories 리스트 가져오기
		List<Repository> repositories=repoService.getRepositories();
		for (Repository repo : repositories) {
			System.out.println(repo.getName());
		}

		return repoService.getRepositories();
	}

	@ResponseBody
	@PostMapping("/post")
	@Operation(summary = "노션 게시글 티스토리 발행")
	public BaseResponse<Object> postNotionToTistory(
		@RequestBody List<PostNotionToTistoryDto> postNotionToTistoryDtoList,
		@AuthenticationPrincipal CustomUserDetails customUserDetails ){

		// security session에 있는 유저 정보를 가져온다
		Optional<Member> member;
		try{
			member = Optional.ofNullable(customUserDetails.getMember());
		}catch (Exception e){
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("로그인된 사용자가 없습니다.")
				.build();
		}

		try{
			return BaseResponse.builder()
				.result(contentService.postNotionToTistory(postNotionToTistoryDtoList, member.get()))
				.resultCode(HttpStatus.OK.value())
				.resultMsg("정상적으로 노션 게시글을 티스토리로 발행했습니다.")
				.build();
		}catch (Exception e){
			e.printStackTrace();
			return BaseResponse.builder()
				.result(null)
				.resultCode(HttpStatus.BAD_REQUEST.value())
				.resultMsg("노션 게시글을 티스토리로 발행하는데 실패했습니다. (지금은 서비스에 AWS Lambda 호출밖에 없어용)")
				.build();
		}
	}
}
