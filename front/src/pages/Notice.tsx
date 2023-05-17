import React from 'react'
import { Helmet } from 'react-helmet-async'

function Notice() {
  return (
    <>
      <Helmet>
        <title>Notice</title>
      </Helmet>
      <h2>2023.05.17</h2><ul><li>전체 기능을 대상으로, API 테스팅 및 부하 테스팅이 진행되었습니다.</li><li>발행 이력 테이블의 View Mode, Edit Mode 관련 디버깅이 진행되었습니다.</li><li>Notion, Tistory, Github 토큰의 암호화 및 복호화가 적용되었습니다.</li><li>Chrome Extension 서비스의 CSS 수정 작업이 진행되었습니다.</li><li>메인 페이지 일부 디자인이 수정되었습니다.</li></ul><h2>2023.05.16</h2><ul><li>2023년 05월 16일, Nogari의 Chrome Extension이 정식 배포되었습니다.</li><li>Github 발행이력 조회 기능이 구현되었습니다.</li><li>Google Form 기반의 설문조사 페이지가 추가되었습니다.</li><li>개인정보 처리방침 페이지가 추가되었습니다.</li></ul><h2>2023.05.12</h2><ul><li>공개여부가 비공개일때, 발행되지 않던 문제가 수정되었습니다.</li><li>Notion, Tistory, Github의 토큰 발급 상태를 확인하는 기능이 추가되었습니다.</li><li>Chrome Extension의 설정 페이지 구현이 완료되었습니다.</li></ul><h2>2023.05.08</h2><ul><li>Tistory 발행 프로세스 진행시, 사용자의 요청 순서와 발행 순서가 일치하지 않는 문제가 수정되었습니다.</li><li>회원가입시 이메일 중복 검사 기능이 구현되었습니다.</li><li>Chrome Extension의 로그인 페이지 구현이 완료되었습니다.</li></ul><h2>2023.05.03</h2><ul><li>Notion To Tistory 발행 및 수정 프로세스에 멀티스레딩이 적용되었습니다.</li><li>Notion, Tistory, Github의 토큰 발급 방식이 변경되었습니다.</li><li>Nogari 로딩 창 구현이 완료되었습니다.</li></ul><h2>2023.04.28</h2><ul><li>Notion 페이지에 업로드된 이미지를 Tistory에 순서대로 발행하는 기능이 구현되었습니다.</li><li>AWS Lambda 함수의 URL 발행이 완료되었습니다.</li></ul><h2>2023.04.27</h2><ul><li>2023년 04월 27일, Nogari 서비스가 AWS EC2에 정식 배포되었습니다.</li><li>Tistory Access Token 및 Github Access Token 연동 기능이 구현되었습니다.</li></ul><h2>2023.04.25</h2><ul><li>Notion 페이지를 마크다운(.md)으로 변환하는 파싱 함수가 구현되었습니다.</li><li>AWS Lambda에 JavaScript 기반의 파싱 함수 적재가 완료되었습니다.</li></ul><p>※ 본 공지사항은 Nogari 서비스를 통해 HTML로 변환된 페이지입니다.</p>
    </>
  )
}

export default Notice
