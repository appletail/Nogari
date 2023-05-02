import { Client } from '@notionhq/client';
import mdToHTML from './service/mdToHTML.js'
import notionToMd from './service/notionToMd.js'
import { get_id } from './utils/notion-to-md/notion.js';
import customNotionToMarkdown from './utils/customNotionToMarkdown.js';

export const handler = async (event: Ievent) => {
  const { notion, type, tistory }: IeventBody = JSON.parse(event.body)
  const { notionToken, page_url } = notion

  // notion page uuid parse
  const page_id = get_id(page_url)

  // notion client object
  const notionClient = new Client({ auth: notionToken });

  let response: Iresponse = {
    title: '',
    content: ''
  }

  // response title
  const title = notionClient.pages.retrieve({ page_id: page_id })
  await title.then((res: any) => {
    response.title = res.properties.title.title[0].plain_text
  })

  // response content
  const custom_n2m = customNotionToMarkdown(notionClient, tistory);
  const mdString = await notionToMd(custom_n2m, page_id)

  // return
  if (type === 'md') {
    response.content = mdString
    return response
  } else if (type === 'html') {
    response.content = await mdToHTML(mdString)
    return response
  }
}