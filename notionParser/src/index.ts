import { Client } from '@notionhq/client';
import notionToHTML from './service/notionToHTML.js'
import notionToMd from './service/notionToMd.js'

export const handler = async (event: { notion: InotionToMd, type: string, tistory?: { access_token: string, blogName: string } }) => {
  const { notion, type } = event
  const { notionToken, blockId } = notion

  const notionClient = new Client({
    auth: notionToken,
  });

  let response: { title: string, content: string | Promise<string> } = { title: '', content: '' }

  const title = notionClient.pages.retrieve({ page_id: blockId })
  await title.then((res: any) => { response['title'] = res.properties.title.title[0].plain_text })

  if (type === 'md') {
    response['content'] = await notionToMd(notionClient, blockId)
    return response
  } else if (type === 'html') {
    response['content'] = await notionToHTML(notionClient, blockId)
    return response
  }
}