export type TMoonCardConfig = {
  darkMode?: boolean
  language?: string
  showAzimuth?: boolean
  showElevation?: boolean
  timeFormat?: '12h' | '24h'
  title?: string
}

export type TMoonCardTime = {
  time: string,
  period?: 'AM' | 'PM'
}

export type TMoonCardData = {
  azimuth: number
  dawnProgressPercent: number
  dayProgressPercent: number
  duskProgressPercent: number
  elevation: number
  error?: string
  moonPercentOverHorizon: number
  moonPosition: {
    x: number
    y: number
  }
  times: {
    dawn: TMoonCardTime
    dusk: TMoonCardTime
    noon: TMoonCardTime
    moonrise: TMoonCardTime
    moonset: TMoonCardTime
  }
}

export type TMoonCardTexts = {
  Azimuth: string
  Dawn: string
  Dusk: string
  Elevation: string
  Noon: string
  Moonrise: string
  Moonset: string

  errors: {
    [key in EMoonCardErrors]: string
  }
}

export enum EMoonCardErrors {
  'MoonIntegrationNotFound' = 'MoonIntegrationNotFound'
}


