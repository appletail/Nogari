import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import setCustomMarkdown from "./setCustomMarkdown.js";

const customNotionToMarkdown = (
  notionClient: Client,
  tistory: Itistory | undefined
): NotionToMarkdown => {
  const n2m = new NotionToMarkdown({ notionClient });
  const custom_n2m = setCustomMarkdown(n2m, notionClient, tistory)
  return custom_n2m
}

export default customNotionToMarkdown