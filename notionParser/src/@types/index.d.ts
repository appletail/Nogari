type color =
  "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

interface styles {
  gray: string;
  brown: string;
  orange: string;
  yellow: string;
  green: string;
  blue: string;
  purple: string;
  pink: string;
  red: string;
  gray_background: string;
  brown_background: string;
  orange_background: string;
  yellow_background: string;
  green_background: string;
  blue_background: string;
  purple_background: string;
  pink_background: string;
  red_background: string;
}
interface InotionToMd {
  notionToken: string;
  page_url: string;
}

interface Ievent {
  body: string
}

interface Itistory {
  access_token: string
  blogName: string
}

interface IeventBody {
  notion: InotionToMd
  type: string
  tistory?: Itistory
}

interface Iresponse {
  title: string
  content: string | Promise<string>
}