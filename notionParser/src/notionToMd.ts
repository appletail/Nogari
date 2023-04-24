import { Client } from "@notionhq/client";
// const { NotionToMarkdown } = require("notion-to-md");
import { writeFileSync } from "fs";
// or
// import { NotionToMarkdown } from "notion-to-md";
import photoToTistory from "./photoToTistory";

import { NotionToMarkdown } from "notion-to-md";
import customNotionToMarkdown from "./utils/customNotionToMarkdown";

interface InotionToMd {
  notionToken: string;
  blockId: string;
}

const notionToMd = ({ notionToken, blockId }: InotionToMd) => {
  const notion = new Client({
    auth: notionToken,
  });

  // passing notion client to the option
  const custom_n2m = customNotionToMarkdown(notion);

  (async () => {
    const mdblocks = await custom_n2m.pageToMarkdown(blockId);
    const mdString = custom_n2m.toMarkdownString(mdblocks);

    //writing to file
    // console.log(mdString);

    // file 형태로 내보내기
    // writeFileSync("test.md", mdString);
    return mdString;
  })();
};

// sample 처럼 object 형태로 함수를 호출하시면 됩니다.

const sample = {
  notionToken: "사용자토큰",
  blockId: "페이지 url 뒤의 block ID",
};
notionToMd(sample);
