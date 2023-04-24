import { Client } from "@notionhq/client"
<<<<<<< HEAD
const { NotionToMarkdown } = require("notion-to-md");
import { writeFileSync } from 'fs';
// or
// import { NotionToMarkdown } from "notion-to-md";
import photoToTistory from "./photoToTistory";



const notion = new Client({
  auth: "secret_W2tdauqeesSK7auwcOvo9dMYgmdffBW0IRXD94LszDg",
});

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });
const block_id = "1318cd9451fd4a6ab5241441f17d99e6";


(async () => {
  // const mdblocks = await n2m.pageToMarkdown(block_id);
  // console.log(mdblocks)
  const {results} = await notion.blocks.children.list({
    block_id,
  })
  // n2m.setCustomTransformer("paragraph", async (block:any) => {
  //   const {paragraph} = block as any;
  //   console.log(paragraph)
  //   const color = paragraph.rich_text?.annotations
  //   // console.log(color)
  //   if (color === "yellow_background") {
  //     return `<span style="background-color:#fff5n1">
  //     ${await n2m.blocksToMarkdown(results)}</span>`
  //   }
  //   else if (color != "default") {
  //     return `<span style="color:${color}"> hello world! </span>`
  //   }
  //   // return false;
  // })
  const x = await n2m.blocksToMarkdown(results);
  // console.log(x);
  const mdString = n2m.toMarkdownString(x);
  
  // writing to file
  writeFileSync("harim2.md", mdString);
=======
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
>>>>>>> dev
})();