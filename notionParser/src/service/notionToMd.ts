// import { writeFileSync } from "fs";
import { NotionToMarkdown } from "notion-to-md";

const notionToMd = async (custom_n2m: NotionToMarkdown, page_url: string) => {
  const mdblocks = await custom_n2m.pageToMarkdown(page_url);
  const mdString = await custom_n2m.toMarkdownString(mdblocks);

  // file 형태로 내보내기
  // writeFileSync("test.md", mdString);

  return mdString
};


export default notionToMd
