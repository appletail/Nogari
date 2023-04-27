import { Client } from '@notionhq/client';
import notionToHTML from './service/notionToHTML.js'
import notionToMd from './service/notionToMd.js'
import { get_id } from './utils/notion.js';

export const handler = async (event: { notion: InotionToMd, type: string, tistory?: { access_token: string, blogName: string } }) => {
  const { notion, type } = event
  const { notionToken, page_url } = notion

  const page_id = get_id(page_url)

  const notionClient = new Client({
    auth: notionToken,
  });

  let response: { title: string, content: string | Promise<string> } = { title: '', content: '' }

  const title = notionClient.pages.retrieve({ page_id: page_id })
  await title.then((res: any) => { response['title'] = res.properties.title.title[0].plain_text })

  if (type === 'md') {
    response['content'] = await notionToMd(notionClient, page_id)
    return response
  } else if (type === 'html') {
    response['content'] = await notionToHTML(notionClient, page_id)
    return response
  }
}