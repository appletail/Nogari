import * as md from './md';
import annotatePlainText from "./annotatePlainText";

const parseText = (block: any, type: any) => {
  let parsedData = ""
  let blockContent = block[type].text || block[type].rich_text || [];
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

  return parsedData
}

export default parseText