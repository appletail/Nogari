import { NotionToMarkdown } from "notion-to-md"
import annotatePlainText from "./annotatePlainText";
import colorToStyle from "./colorToStyle"
import * as md from './md';

const setCustomMarkdown = (n2m: NotionToMarkdown): NotionToMarkdown => {

  n2m.setCustomTransformer("heading_1", async (block: any): Promise<any> => {
    const color = block.heading_1.color
    console.log(block.heading_1)

    let parsedData = ""
    let blockContent = block.heading_1.text || block.heading_1.rich_text || [];
    blockContent.map((content: any) => {
      if (content.type === 'equation') {
        parsedData += md.inlineEquation(content.equation.expression);
        return;
      }

      const annotations = content.annotations;
      let plain_text = content.plain_text;

      plain_text = annotatePlainText(plain_text, annotations);

      if (content["href"])
        plain_text = md.link(plain_text, content["href"]);

      parsedData += plain_text;
    });


    if (color !== "default") {
      return `# <span style="${colorToStyle(color)}">${parsedData}</span>`
    }
    return false; // use default behavior
  });

  return n2m
}

export default setCustomMarkdown