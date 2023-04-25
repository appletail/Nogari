import { Client } from "@notionhq/client";
import customNotionToMarkdown from "../utils/customNotionToMarkdown";
import { writeFileSync } from "fs";

const notionToMd = async ({ notionToken, blockId }: InotionToMd) => {
  const notion = new Client({
    auth: notionToken,
  });

  const custom_n2m = customNotionToMarkdown(notion);
  const mdblocks = await custom_n2m.pageToMarkdown(blockId);
  const mdString = await custom_n2m.toMarkdownString(mdblocks);

  // file 형태로 내보내기
  writeFileSync("test.md", mdString);

  return mdString
};


export default notionToMd
