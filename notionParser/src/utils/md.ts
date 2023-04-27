import markdownTable from "markdown-table";
import { CalloutIcon } from "notion-to-md/build/types";
import colorToStyle from "./colorToStyle.js";

export const inlineCode = (text: string) => {
  return `\`${text}\``;
};

export const inlineEquation = (text: string) => {
  return `$${text}$`;
};

export const bold = (text: string) => {
  return `**${text}**`;
};

export const italic = (text: string) => {
  return `*${text}*`;
};

export const strikethrough = (text: string) => {
  return `~~${text}~~`;
};

export const underline = (text: string) => {
  return `<u>${text}</u>`;
};

export const link = (text: string, href: string) => {
  return `[${text}](${href})`;
};

export const codeBlock = (text: string, language?: string) => {
  if (language === "plain text") language = "text";

  return `\`\`\`${language}
${text}
\`\`\``;
};

export const equation = (text: string) => {
  return `$$
${text}
$$`;
};

export const heading1 = (text: string, color: color) => {
  return color !== 'default' ? `# <span style="${colorToStyle(color)}">${text}</span>` : `# ${text}`;
};

export const heading2 = (text: string, color: color) => {
  return color !== 'default' ? `## <span style="${colorToStyle(color)}">${text}</span>` : `## ${text}`;
};

export const heading3 = (text: string, color: color) => {
  return color !== 'default' ? `### <span style="${colorToStyle(color)}">${text}</span>` : `### ${text}`;
};

export const quote = (text: string, color: color) => {
  // the replace is done to handle multiple lines
  return color !== 'default' ? `> <span style="${colorToStyle(color)}">${text.replace(/\n/g, "  \n> ")}</span>` : `> ${text.replace(/\n/g, "  \n> ")}`;
};

export const callout = (text: string, icon?: CalloutIcon) => {
  let emoji: string | undefined;
  if (icon?.type === "emoji") {
    emoji = icon.emoji;
  }

  // the replace is done to handle multiple lines
  return `> ${emoji ? emoji + " " : ""}${text.replace(/\n/g, "  \n> ")}`;
};

export const bullet = (text: string, color: color, count?: number) => {
  let renderText = text.trim();
  return color !== 'default' ? count ? `${count}. <span style="${colorToStyle(color)}">${renderText}</span>` : `- <span style="${colorToStyle(color)}">${renderText}</span>` : count ? `${count}. ${renderText}` : `- ${renderText}`;
};

export const todo = (text: string, color: color, checked: boolean) => {
  return color !== 'default' ? checked ? `- <span style="${colorToStyle(color)}">[x] ${text}</span>` : `- <span style="${colorToStyle(color)}">[ ] ${text}</span>` : checked ? `- [x] ${text}` : `- [ ] ${text}`;
};

export const image = (alt: string, href: string) => {
  return `![${alt}](${href})`;
};

export const addTabSpace = (text: string, n = 0) => {
  const tab = "	";
  for (let i = 0; i < n; i++) {
    if (text.includes("\n")) {
      const multiLineText = text.split(/(?<=\n)/).join(tab);
      text = tab + multiLineText;
    } else text = tab + text;
  }
  return text;
};

export const divider = () => {
  return "---";
};

export const toggle = (summary?: string, children?: string) => {
  if (!summary) return children || "";
  return `<details>
  <summary>${summary}</summary>

${children || ""}

  </details>`;
};

export const table = (cells: string[][]) => {
  return markdownTable(cells);
};
