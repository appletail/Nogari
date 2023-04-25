import notionToMd from './service/notionToMd'

export const handler = async (event: { notion: InotionToMd, type: string }) => {
  const { notion, type } = event
  if (type === 'md') {
    return notionToMd(notion)
  }
}