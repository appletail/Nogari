export const get_id = () => {

  let url
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0]
    url = tab.url
  })
  if (!url) return
  console.log(url)
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