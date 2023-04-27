const styles: styles = {
  gray: "color: #787774",
  brown: "color: #9F6B53",
  orange: "color: #D9730D",
  yellow: "color: #CB912F",
  green: "color: #448361",
  blue: "color: #337EA9",
  purple: "color: #9065B0",
  pink: "color: #C14C8A",
  red: "color: #D44C47",
  gray_background: "background-color: #F1F1EF",
  brown_background: "background-color: #F4EEEE",
  orange_background: "background-color: #FBECDD",
  yellow_background: "background-color: #FBF3DB",
  green_background: "background-color: #EDF3EC",
  blue_background: "background-color: #E7F3F8",
  purple_background: "background-color: #F4F0F7CC",
  pink_background: "background-color: #F9EEF3CC",
  red_background: "background-color: #FDEBEC",
}

const colorToStyle = (color: color): string => {
  if (color !== 'default') {
    return styles[color]
  } else {
    return 'color: #37352F'
  }
}

export default colorToStyle