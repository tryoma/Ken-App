import { SessionTrace } from '@newrelic/browser-agent'
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

// Populate using values in copy-paste JavaScript snippet.
const options = {
  init: {
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.nr-data.net'] },
  }, // NREUM.init
  info: {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: 'NRJS-303702516df5b47b87f',
    applicationID: '594479880',
    sa: 1,
  }, // NREUM.info
  loader_config: {
    accountID: '4413352',
    trustKey: '4413352',
    agentID: '594479880',
    licenseKey: 'NRJS-303702516df5b47b87f',
    applicationID: '594479880',
  },
  features: [
    SessionTrace
  ] // NREUM.loader_config
}

// The agent loader code executes immediately on instantiation.
export const newrelic = new BrowserAgent(options)
