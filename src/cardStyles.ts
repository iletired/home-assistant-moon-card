import { css } from 'lit-element'

export default css`
  .moon-card {
    --moon-card-lines: #464646;
    --moon-card-text-color: #fff;
    --moon-card-subtitle-color: #fff;

    color: var(--moon-card-text-color);
    padding: 1rem;
  }

  .moon-card-body {
    padding-top: 0.5rem;
  }

  .moon-card.moon-card-light {
    --moon-card-lines: #ececec;
    --moon-card-text-color: #000;
    --moon-card-subtitle-color: #828282;
  }

  .moon-card-header {
    display: flex;
    justify-content: space-between;
  }
  
  .moon-card-footer .moon-card-footer-row {
    display: flex;
    justify-content: space-around;
    padding-top: 1.5rem;
  }

  .moon-card-title {
    font-size: 1.5rem;
    font-weight: 500;
    padding-bottom: 2rem;
    margin: 0;
  }

  .moon-card-text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .moon-card-header .moon-card-text-subtitle {
    font-size: 1.15rem;
    font-weight: 400;
    padding-bottom: 0.25rem;
    color: var(--moon-card-subtitle-color);
  }

  .moon-card-header .moon-card-text-time {
    font-size: 1.85rem;
    font-weight: 400;
  }

  .moon-card-footer .moon-card-text-subtitle {
    font-size: 1.25rem;
    font-weight: 400;
    padding-bottom: 0.5rem;
    color: var(--moon-card-subtitle-color);
  }

  .moon-card-footer .moon-card-text-time {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .moon-card-text-time-period {
    font-size: 0.75rem;
  }
`


