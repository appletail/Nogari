import React from 'react'
import axios from 'axios';

// Tistory에 사진을 첨부하기 위한 api 요청을 위한 data

const BLOG_NAME = "mummur"  // tistory blog name
const TISTORY_TOKEN = "793ed0f76bb104f2250989eaa767a1d8_a0ca8f791f425bc95f5c1f30dc76a99a" // tistory access token

// tistory에 요청을 보내는 instance
const instance = axios.post('https://www.tistory.com/apis/post/attach',{
  params: {
    "access_token" : TISTORY_TOKEN,
    "blogName" : BLOG_NAME
  }
}).then((res)=>console.log(res)).catch((err)=>console.log(err));

function photoToTistory() {
  return (
  instance
  )
}

export default photoToTistory