import { Client } from "@notionhq/client"
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
})();