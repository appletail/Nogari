import notionToMd from './service/notionToMd'

const event = {
  notion: {
    notionToken: 'secret_8G7IKNd4Rn1spLwhzO9LTg6t4KIHA5V7dsKrcEWyfuG',
    blockId: 'a31d97d7d02045c1b4faddab95b97b67'
  },
  type: 'md'
}

export const handler = async (event: { notion: InotionToMd, type: string }) => {
  const { notion, type } = event
  if (type === 'md') {
    return notionToMd(notion)
  }
}

handler(event)