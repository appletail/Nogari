import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";
import { ListBlockChildrenResponseResults } from "notion-to-md/build/types";
import { URL } from 'url';


export const getBlockChildren = async (
  notionClient: Client,
  block_id: string,
  totalPage: number | null
) => {
  try {
    let result: ListBlockChildrenResponseResults = [];
    let pageCount = 0;
    let start_cursor = undefined;

    do {
      const response = (await notionClient.blocks.children.list({
        start_cursor: start_cursor,
        block_id: block_id,
      })) as ListBlockChildrenResponse;
      result.push(...response.results);

      start_cursor = response?.next_cursor;
      pageCount += 1;
    } while (
      start_cursor != null &&
      (totalPage == null || pageCount < totalPage)
    );

    modifyNumberedListObject(result);
    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const modifyNumberedListObject = (
  blocks: ListBlockChildrenResponseResults
) => {
  let numberedListIndex = 0;

  for (const block of blocks) {
    if ("type" in block && block.type === "numbered_list_item") {
      // add numbers
      // @ts-ignore
      block.numbered_list_item.number = ++numberedListIndex;
    }
    else {
      numberedListIndex = 0;
    }
  }
};


export const get_id = (url: string): string => {
  const parsed = new URL(url);
  if (parsed.hostname !== 'notion.so' && parsed.hostname !== 'www.notion.so') {
    throw new Error('Not a valid Notion URL.');
  }
  const path = parsed.pathname;
  if (path.length < 32) {
    throw new Error('The path in the URL seems to be incorrect.');
  }
  const raw_id = path.slice(-32);

  return raw_id
}