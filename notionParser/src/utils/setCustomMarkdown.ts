import { NotionToMarkdown } from "notion-to-md"
import parseText from "./parseText";
import * as md from './md';
import colorToStyle from "./colorToStyle";


const setCustomMarkdown = (n2m: NotionToMarkdown): NotionToMarkdown => {

  n2m.setCustomTransformer("heading_1", async (block: any): Promise<any> => {
    const color = block.heading_1.color
    const parsedData = parseText(block, "heading_1")

    if (color !== "default") return md.heading1(parsedData, color)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("heading_2", async (block: any): Promise<any> => {
    const color = block.heading_2.color
    const parsedData = parseText(block, "heading_2")

    if (color !== "default") return md.heading2(parsedData, color)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("heading_3", async (block: any): Promise<any> => {
    const color = block.heading_3.color
    const parsedData = parseText(block, "heading_3")

    if (color !== "default") return md.heading3(parsedData, color)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("quote", async (block: any): Promise<any> => {
    const color = block.quote.color
    const parsedData = parseText(block, "quote")

    if (color !== "default") return md.quote(parsedData, color)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("bulleted_list_item", async (block: any): Promise<any> => {
    const color = block.bulleted_list_item.color
    const parsedData = parseText(block, "bulleted_list_item")

    if (color !== "default") return md.bullet(parsedData, color)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("numbered_list_item", async (block: any): Promise<any> => {
    const color = block.numbered_list_item.color
    const parsedData = parseText(block, "numbered_list_item")

    if (color !== "default") return md.bullet(parsedData, color, block.numbered_list_item.number)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("to_do", async (block: any): Promise<any> => {
    const color = block.to_do.color
    const parsedData = parseText(block, "to_do")

    if (color !== "default") return md.todo(parsedData, color, block.to_do.checked)

    return false; // use default behavior
  });
  n2m.setCustomTransformer("paragraph", async (block: any): Promise<any> => {
    const color = block.paragraph.color
    const parsedData = parseText(block, "paragraph")

    return (color !== "default" && color !== undefined) ? `<span style="${colorToStyle(color)}">${parsedData}</span>` : parsedData
  });

  return n2m
}

export default setCustomMarkdown