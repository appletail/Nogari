import { Client } from "@notionhq/client"
// const { NotionToMarkdown } = require("notion-to-md");
import { writeFileSync } from 'fs';
// or
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: "secret_OJV9jrAZksbShNhS53oGKrUfPRL5u33h14z1BZCr6jW",
});

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

(async () => {
  const mdblocks = await n2m.pageToMarkdown("19f5ec24f45e4c1e947f5ddddeb8667e");
  const mdString = n2m.toMarkdownString(mdblocks);

  //writing to file
  writeFileSync("test.md", mdString);
})();