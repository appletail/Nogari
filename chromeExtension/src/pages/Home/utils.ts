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

export const setBackgroundColor = (status: any) => {
  return status === '발행요청'
    ? '#E7EEFD'
    : status === '수정요청'
      ? '#F6EADA'
      : status === '발행완료'
        ? '#E2F6F0'
        : '#FDE8E7'
}

export const setColor = (status: any) => {
  return status === '발행요청'
    ? '#4769B1'
    : status === '수정요청'
      ? '#B54708'
      : status === '발행완료'
        ? '#3D9C7D'
        : '#B42318'
}

export const toDoubleDigit = (num: number) => num.toString().length < 2 ? `0${num}` : num

export const setLogResponse = (data: any) => {
  const date = new Date(data.modifiedDate)
  const logDate = [date.getFullYear(), date.getMonth(), date.getDate()]
  return {
    title: data.title,
    status: data.status,
    responseLink: data.responseLink,
    date: `${logDate[0]}-${toDoubleDigit(logDate[1] + 1)}-${toDoubleDigit(logDate[2])} / ${date.toTimeString().split(' ')[0]
      }`,
  }
}
