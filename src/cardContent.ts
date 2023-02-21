import { html, TemplateResult } from 'lit-element'
import { TMoonCardConfig, TMoonCardData, TMoonCardTexts, TMoonCardTime } from './types'

export class MoonCardContent {
  static generate (data: TMoonCardData, localization: TMoonCardTexts, config: TMoonCardConfig): TemplateResult {
    if (data?.error) {
      return html`
        <ha-card>
          ${this.generateError()}
        </ha-card>
      `
    }

    return html`
      <ha-card>
        <div class="moon-card ${config.darkMode ? '' : 'moon-card-light'}">
          ${this.generateHeader(data, localization, config)}
          ${this.generateBody(data)}
          ${this.generateFooter(data, localization, config)}
        </div>
      </ha-card>
    `
  }

  private static generateHeader (data: TMoonCardData, localization: TMoonCardTexts, config: TMoonCardConfig): TemplateResult {
    const title = config.title !== undefined ? html`
      <h1 class="moon-card-title">${config.title}</h1>
    ` : html``

    return html`
      ${title}
      <div class="moon-card-header">
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Moonrise}</span>
          ${data?.times.moonrise ? this.generateTime(data.times.Moonrise) : ''}

        </div>
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.moonset}</span>
          ${data?.times.moonset ? this.generateTime(data.times.moonset) : ''}
        </div>
      </div>
    `
  }

  private static generateBody (data: TMoonCardData): TemplateResult {
    const moonID = Math.random().toString(36).replace('0.', '')
    const dawnID = Math.random().toString(36).replace('0.', '')
    const dayID = Math.random().toString(36).replace('0.', '')
    const duskID = Math.random().toString(36).replace('0.', '')

    return html`
      <div class="moon-card-body">
        <svg viewBox="0 0 550 150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${moonID}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#f9d05e;stop-opacity:1" />
              <stop offset="${data?.moonPercentOverHorizon ?? 0}%" style="stop-color:#f9d05e;stop-opacity:1" />
              <stop offset="${data?.moonPercentOverHorizon ?? 0}%" style="stop-color:rgb(0,0,0,0);stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="${dawnID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#393b78;stop-opacity:1" />
              <stop offset="${data?.dawnProgressPercent ?? 0}%" style="stop-color:#393b78;stop-opacity:1" />
              <stop offset="${data?.dawnProgressPercent ?? 0}%" style="stop-color:rgb(0,0,0,0);stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="${dayID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#8ebeeb;stop-opacity:1" />
              <stop offset="${data?.dayProgressPercent ?? 0}%" style="stop-color:#8ebeeb;stop-opacity:1" />
              <stop offset="${data?.dayProgressPercent ?? 0}%" style="stop-color:rgb(0,0,0,0);stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="${duskID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#393b78;stop-opacity:1" />
              <stop offset="${data?.duskProgressPercent ?? 0}%" style="stop-color:#393b78;stop-opacity:1" />
              <stop offset="${data?.duskProgressPercent ?? 0}%" style="stop-color:rgb(0,0,0,0);stop-opacity:1" />
            </linearGradient>
          </defs>
          <path class="moon-card-moon-line" d="M5,146 C29,153 73,128 101,108 C276,-29 342,23 449,108 C473,123 509,150 545,146" fill="none" stroke="var(--moon-card-lines)" shape-rendering="geometricPrecision" />
          <path d="M5,146 C29,153 73,128 101,108 L 5 108" fill="url(#${dawnID})" opacity="${data?.dawnProgressPercent ? 1 : 0}" stroke="url(#${dawnID})" shape-rendering="geometricPrecision" />
          <path d="M101,108 C276,-29 342,23 449,108 L 104,108" fill="url(#${dayID})" opacity="${data?.dayProgressPercent ? 1 : 0}" stroke="url(#${dayID})" shape-rendering="geometricPrecision" />
          <path d="M449,108 C473,123 509,150 545,146 L 545 108" fill="url(#${duskID})" opacity="${data?.duskProgressPercent ? 1 : 0}" stroke="url(#${duskID})" shape-rendering="geometricPrecision" />
          <line x1="5" y1="108" x2="545" y2="108" stroke="var(--moon-card-lines)" />
          <line x1="101" y1="25" x2="101" y2="100" stroke="var(--moon-card-lines)" />
          <line x1="449" y1="25" x2="449" y2="100" stroke="var(--moon-card-lines)" />
          <circle cx="${data?.moonPosition.x ?? 0}" cy="${data?.moonPosition.y ?? 0}" r="17" opacity="${data?.moonPercentOverHorizon ? 1 : 0}" stroke="none" fill="url(#${sunID})" shape-rendering="geometricPrecision" />
        </svg>
      </div>
    `
  }

  private static generateError (): TemplateResult {
    return html`
      <hui-error-card></hui-error-card>
    `
  }

  private static generateFooter (data: TMoonCardData, localization: TMoonCardTexts, config: TMoonCardConfig): TemplateResult {
    const upperRow = html`
      <div class="moon-card-footer-row">
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Dawn}</span>
          ${data?.times.dawn ? this.generateTime(data.times.dawn) : ''}
        </div>
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Noon}</span>
          ${data?.times.noon ? this.generateTime(data.times.noon) : ''}
        </div>
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Dusk}</span>
          ${data?.times.dusk ? this.generateTime(data.times.dusk) : ''}
        </div>
      </div>
    `

    let bottomRow = html``
    if (config.showAzimuth || config.showElevation) {
      const azimuth = config.showAzimuth ? html`
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Azimuth}</span>
          <span class="moon-card-dawn-time moon-card-text-time">${data?.azimuth ?? ''}</span>
        </div>
      ` : html``

      const elevation = config.showElevation ? html`
        <div class="moon-card-text-container">
          <span class="moon-card-text-subtitle">${localization.Elevation}</span>
          <span class="moon-card-dawn-time moon-card-text-time">${data?.elevation ?? ''}</span>
        </div>
      ` : html``
  
      bottomRow = html`
        <div class="moon-card-footer-row">
          ${azimuth}
          ${elevation}
        </div>
      `
    }

    return html`
      <div class="moon-card-footer">
        ${upperRow}
        ${bottomRow}
      </div>
    `
  }

  private static generateTime (time: TMoonCardTime) {
    if (time.period) {
      return html`
        <span class="moon-card-text-time">
          ${time.time} <span class="moon-card-text-time-period">${time.period}</span>
        </span>
      `
    }
    
    return html`
      <span class="moon-card-text-time">${time.time}</span>
    `
  }
}
