const getFileName = (url: string) => {
  const splitedURL = url.split('?')[0].split('/')
  return decodeURI(splitedURL[splitedURL.length - 1])
}

export default getFileName