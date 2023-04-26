import notionToMd from "./notionToMd.js";
// import { writeFileSync } from "fs";
import MarkdownIt from 'markdown-it'
import { Client } from "@notionhq/client";

const notionToHTML = async (notionToken: Client, blockId: string) => {
  const mdString = await notionToMd(notionToken, blockId)
  const markDownIt = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,        // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    breaks: true,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    linkify: false,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (/*str, lang*/) { return ''; }
  });
  const html_text = markDownIt.render(mdString);

  // file 형태로 내보내기
  // writeFileSync("test.html", html_text);

  return html_text
}

export default notionToHTML