import { Client } from "@notionhq/client";
import customNotionToMarkdown from "../utils/customNotionToMarkdown.js";
// import { writeFileSync } from "fs";

const notionToMd = async (notionToken: Client, page_url: string) => {
  const custom_n2m = customNotionToMarkdown(notionToken);
  const mdblocks = await custom_n2m.pageToMarkdown(page_url);
  const mdString = await custom_n2m.toMarkdownString(mdblocks);

  // file 형태로 내보내기
  // writeFileSync("test.md", mdString);

  return mdString
};


export default notionToMd
