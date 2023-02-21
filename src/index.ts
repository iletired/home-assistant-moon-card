import { HomeAssistant } from 'custom-card-helpers'
import { customElement, LitElement, state } from 'lit-element'

import cardStyles from './cardStyles'
import { Constants } from './constants'
import { MoonCardContent } from './cardContent'
import { EMoonCardErrors, TMoonCardConfig, TMoonCardData } from './types'

@customElement('moon-card')
class MoonCard extends LitElement {
  static readonly cardType = 'moon-card'
  static readonly cardName = 'Moon Card'
  static readonly cardDescription = 'Custom card that display a graph to track the moon position and related events'

  @state()
  private config: TMoonCardConfig = {}

  @state()
  private data!: TMoonCardData

  private hasRendered = false
  private lastHass!: HomeAssistant

  set hass (hass: HomeAssistant) {
    this.lastHass = hass

    if (!this.hasRendered) {
      return
    }

    this.processLastHass()
  }

  calculatePositionAndProgressesByTime (hass: HomeAssistant) {
    const moonLine = this.shadowRoot?.querySelector('path') as SVGPathElement
    const moonrise = new Date(hass.states['moon.moon'].attributes.next_rising)
    const moonset = new Date(hass.states['moon.moon'].attributes.next_setting)
    const eventsAt = {
      dayStart: 0,
      moonrise: this.convertDateToMinutesSinceDayStarted(moonrise),
      moonset: this.convertDateToMinutesSinceDayStarted(moonset),
      dayEnd: (23 * 60) + 59
    }

    const now = new Date()
    const minutesSinceTodayStarted = this.convertDateToMinutesSinceDayStarted(now)
    
    // Dawn section position [0 - 105]
    const dawnSectionPosition = (Math.min(minutesSinceTodayStarted, eventsAt.moonrise) * 105) / eventsAt.moonrise

    // Day section position [106 - 499]
    const minutesSinceDayStarted = Math.max(minutesSinceTodayStarted - eventsAt.moonrise, 0)
    const daySectionPosition = (Math.min(minutesSinceDayStarted, eventsAt.moonset - eventsAt.moonrise) * (499 - 106)) / (eventsAt.moonset - eventsAt.moonrise)

    // Dusk section position [500 - 605]
    const minutesSinceDuskStarted = Math.max(minutesSinceTodayStarted - eventsAt.moonset, 0)
    const duskSectionPosition = (minutesSinceDuskStarted * (605 - 500)) / (eventsAt.dayEnd - eventsAt.moonset)

    const position = dawnSectionPosition + daySectionPosition + duskSectionPosition
    const moonPosition = moonLine.getPointAtLength(position)

    const dawnProgressPercent = (100 * (moonPosition.x - Constants.EVENT_X_POSITIONS.dayStart)) / (Constants.EVENT_X_POSITIONS.moonrise - Constants.EVENT_X_POSITIONS.dayStart)
    const dayProgressPercent = (100 * (moonPosition.x - Constants.EVENT_X_POSITIONS.moonrise)) / (Constants.EVENT_X_POSITIONS.moonset - Constants.EVENT_X_POSITIONS.moonrise)
    const duskProgressPercent = (100 * (moonPosition.x - Constants.EVENT_X_POSITIONS.moonset)) / (Constants.EVENT_X_POSITIONS.dayEnd - Constants.EVENT_X_POSITIONS.moonset)

    const moonYTop = moonPosition.y - Constants.SUN_RADIUS
    const yOver = Constants.HORIZON_Y - moonYTop
    let moonPercentOverHorizon = 0
    if (yOver > 0) {
      moonPercentOverHorizon = Math.min((100 * yOver) / (2 * Constants.SUN_RADIUS), 100)
    }

    return {
      dawnProgressPercent,
      dayProgressPercent,
      duskProgressPercent,
      moonPercentOverHorizon,
      moonPosition: { x: moonPosition.x, y: moonPosition.y }
    }
  }

  convertDateToMinutesSinceDayStarted (date: Date) {
    return (date.getHours() * 60) + date.getMinutes()
  }

  parseTime (timeText: string, locale?: string) {
    const regex = /\d{1,2}[:.]\d{1,2}|[AMP]+/g
    const date = new Date(timeText)
    const { language, timeFormat } = this.getConfig()
    const result = date.toLocaleTimeString(locale ?? language, { hour12: timeFormat === '12h' }).match(regex) as [string, ('AM' | 'PM')?]

    if (!result && !locale) {
      return this.parseTime(timeText, Constants.DEFAULT_CONFIG.language)
    }

    const [time, period] = result
    return { time, period }
  }

  processLastHass () {
    if (!this.lastHass) {
      return
    }

    if (!this.lastHass.states['moon.moon']) {
      return this.showError(EMoonCardErrors.MoonIntegrationNotFound)
    }
  
    this.config.darkMode = this.config.darkMode ?? this.lastHass.themes.darkMode
    this.config.language = this.config.language ?? this.lastHass.locale?.language ?? this.lastHass.language
    this.config.timeFormat = this.config.timeFormat ?? this.getTimeFormatByLanguage(this.config.language)

    const times = {
      dawn: this.parseTime(this.lastHass.states['moon.moon'].attributes.next_dawn),
      dusk: this.parseTime(this.lastHass.states['moon.moon'].attributes.next_dusk),
      noon: this.parseTime(this.lastHass.states['moon.moon'].attributes.next_noon),
      moonrise: this.parseTime(this.lastHass.states['moon.moon'].attributes.next_rising),
      moonset: this.parseTime(this.lastHass.states['moon.moon'].attributes.next_setting)
    }

    const {
      dawnProgressPercent,
      dayProgressPercent,
      duskProgressPercent,
      moonPercentOverHorizon,
      moonPosition
    } = this.calculatePositionAndProgressesByTime(this.lastHass)

    const data: TMoonCardData = {
      azimuth: this.lastHass.states['moon.moon'].attributes.azimuth,
      dawnProgressPercent,
      dayProgressPercent,
      duskProgressPercent,
      elevation: this.lastHass.states['moon.moon'].attributes.elevation,
      moonPercentOverHorizon,
      moonPosition,
      times
    }

    this.data = data
  }

  getConfig () {
    const config: TMoonCardConfig = {}
    config.darkMode = this.config.darkMode ?? Constants.DEFAULT_CONFIG.darkMode
    config.language = this.config.language ?? Constants.DEFAULT_CONFIG.language
    config.showAzimuth = this.config.showAzimuth ?? Constants.DEFAULT_CONFIG.showAzimuth
    config.showElevation = this.config.showElevation ?? Constants.DEFAULT_CONFIG.showElevation
    config.timeFormat = this.config.timeFormat ?? Constants.DEFAULT_CONFIG.timeFormat
    config.title = this.config.title

    if (!Object.keys(Constants.LOCALIZATION_LANGUAGES).includes(config.language!)) {
      config.language = Constants.DEFAULT_CONFIG.language
    }

    return config
  }

  getTimeFormatByLanguage (language: string) {
    const date = new Date()
    const time = date.toLocaleTimeString(language).toLocaleLowerCase()
    return time.includes('pm') || time.includes('am') ? '12h' : '24h'
  }

  setConfig (config: TMoonCardConfig) {
    this.config = { ...config }
  }

  showError (error: EMoonCardErrors) {
    this.data = { error } as TMoonCardData
  }
  
  protected render () {
    const config = this.getConfig()
    const language = config.language!
    const localization = Constants.LOCALIZATION_LANGUAGES[language]
    return MoonCardContent.generate(this.data, localization, config)
  }

  protected updated (changedProperties) {
    super.updated(changedProperties)

    if (!this.hasRendered) {
      this.hasRendered = true
      this.processLastHass()
      return
    }

    if (this.data.error) {
      const errorElement = this.shadowRoot?.querySelector('hui-error-card') as HTMLElement & { setConfig (config: { error: string }): void }
      if (errorElement) {
        const config = this.getConfig()
        const language = config.language!
        const localization = Constants.LOCALIZATION_LANGUAGES[language]
        const error = localization.errors[this.data.error]
        errorElement.setConfig?.({ error })
        console.error(error)
      }
    }
  }

  static get styles () {
    return cardStyles
  }
}

window.customCards = window.customCards || [] 
window.customCards.push({
  type: MoonCard.cardType,
  name: MoonCard.cardName,
  description: MoonCard.cardDescription
})


