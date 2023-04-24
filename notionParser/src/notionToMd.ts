import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md";
import { writeFileSync } from 'fs';
import customNotionToMarkdown from "./utils/customNotionToMarkdown";

const notion = new Client({
  auth: "사용자 엑세스 토큰",
});

// passing notion client to the option
const custom_n2m = customNotionToMarkdown(notion);

(async () => {
  const mdblocks = await custom_n2m.pageToMarkdown("노션 페이지 혹은 블럭 고유 id");
  const mdString = custom_n2m.toMarkdownString(mdblocks);

  //writing to file
  writeFileSync("test.md", mdString);
})();