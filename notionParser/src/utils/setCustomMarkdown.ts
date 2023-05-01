import { NotionToMarkdown } from "notion-to-md"
import parseText from "./notion-to-md/parseText.js";
import * as md from './notion-to-md/md.js';
import colorToStyle from "./colorToStyle.js";
import { getBlockChildren } from "./notion-to-md/notion.js";
import { Client } from "@notionhq/client";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints.js";
import axios from "axios";


const setCustomMarkdown = (
  n2m: NotionToMarkdown,
  notionClient: Client,
  tistory: Itistory | undefined
): NotionToMarkdown => {

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
  n2m.setCustomTransformer("callout", async (block: any): Promise<any> => {
    const color = block.callout.color

    let parsedData = parseText(block, "callout")

    const { id, has_children } = block;
    let callout_string = "";

    if (!has_children) {
      parsedData = md.callout(parsedData, block["callout"].icon);
      return parsedData

    }

    const callout_children_object = await getBlockChildren(notionClient, id, 100);

    // // parse children blocks to md object
    const callout_children = await n2m.blocksToMarkdown(
      callout_children_object
    );

    callout_string += `${parsedData}\n`;
    callout_children.map((child) => {
      callout_string += `${child.parent}\n\n`;
    });
    parsedData = md.callout(callout_string.trim(), block["callout"].icon);

    return parsedData
  });
  n2m.setCustomTransformer("image", async (block: any): Promise<any> => {
    let blockContent = block.image;
    let error_message: string = 'tistory 관련 알 수 오류가 발생했습니다.'
    const image_caption_plain = blockContent.caption
      .map((item: RichTextItemResponse) => item.plain_text)
      .join("");
    const image_type = blockContent.type;
    if (image_type === "external")
      return md.image(image_caption_plain, blockContent.external.url);
    if (image_type === "file") {
      if (tistory) {
        // getFile
        const url = await axios({
          url: blockContent.file.url,
          responseType: 'arraybuffer'
        })
          .then((res) => {
            const formData = new FormData();
            formData.append('output', 'json')
            formData.append('access_token', tistory.access_token)
            formData.append('blogName', tistory.blogName)
            formData.append('uploadedfile', new Blob([res.data], { type: 'image/jpeg' }), 'image.jpg');

            return formData
          })
          .then(async (data) => {
            return await axios({
              method: 'post',
              url: 'https://www.tistory.com/apis/post/attach?',
              data
            })
              .then((res) => {
                return res.data.tistory.url
              }).catch((err) => { error_message = err.response.data.tistory.error_message })
          })
          .catch((err) => { error_message = err.response.data.tistory.error_message })

        // get tistory url
        if (!url) throw new Error(error_message)
        return md.image(image_caption_plain, url);
      } else {
        return md.image(image_caption_plain, blockContent.file.url);
      }
    }
  });


  return n2m
}

export default setCustomMarkdown