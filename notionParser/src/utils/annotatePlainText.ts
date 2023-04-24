import { Annotations } from "notion-to-md/build/types";
import * as md from './md';


function annotatePlainText(text: string, annotations: Annotations): string {
  // if text is all spaces, don't annotate
  if (text.match(/^\s*$/)) return text;

  const leadingSpaceMatch = text.match(/^(\s*)/);
  const trailingSpaceMatch = text.match(/(\s*)$/);

  const leading_space = leadingSpaceMatch ? leadingSpaceMatch[0] : "";
  const trailing_space = trailingSpaceMatch ? trailingSpaceMatch[0] : "";

  text = text.trim();

  if (text !== "") {
    if (annotations.code) text = md.inlineCode(text);
    if (annotations.bold) text = md.bold(text);
    if (annotations.italic) text = md.italic(text);
    if (annotations.strikethrough) text = md.strikethrough(text);
    if (annotations.underline) text = md.underline(text);
  }

  return leading_space + text + trailing_space;
}

export default annotatePlainText