export const checkUrl = (url: string | undefined): boolean => {

  if (!url) {
    return false
  }
  const parsed = new URL(url);
  if (parsed.hostname !== 'notion.so' && parsed.hostname !== 'www.notion.so') {
    return false
  }
  const path = parsed.pathname;
  if (path.length < 32) {
    return false
  }

  return true
}