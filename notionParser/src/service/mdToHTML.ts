import { writeFileSync } from "fs";
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import katexHeader from "../utils/styleHead.js";


const mdToHTML = async (mdString: string) => {

  const markDownIt = new MarkdownIt({
    html: true
  }).use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });

  const html_text = katexHeader + markDownIt.render(mdString);

  // file 형태로 내보내기
  writeFileSync("test.html", html_text);

  return html_text
}

export default mdToHTML