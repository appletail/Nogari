import { Theme, ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    status: {
      danger: string
    }
    customShadows?: {
      z1: string
      z4: string
      z8: string
      z12: string
      z16: string
      z20: string
      z24: string
      primary: string
      info: string
      secondary: string
      warning: string
      error: string
      card: string
      dialog: string
      dropdown: string
    }
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    status?: {
      danger?: string
    }
    customShadows: {
      z1: string
      z4: string
      z8: string
      z12: string
      z16: string
      z20: string
      z24: string
      primary: string
      info: string
      secondary: string
      warning: string
      error: string
      card: string
      dialog: string
      dropdown: string
    }
  }
  export function createTheme(options?: CustomThemeOptions): CustomTheme
}
