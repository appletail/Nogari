import { Client } from "@notionhq/client";
import customNotionToMarkdown from "../utils/customNotionToMarkdown.js";
// import { writeFileSync } from "fs";

const notionToMd = async (notionToken: Client, blockId: string) => {
  const custom_n2m = customNotionToMarkdown(notionToken);
  const mdblocks = await custom_n2m.pageToMarkdown(blockId);
  const mdString = await custom_n2m.toMarkdownString(mdblocks);

  // file 형태로 내보내기
  // writeFileSync("test.md", mdString);

  return mdString
};


export default notionToMd
