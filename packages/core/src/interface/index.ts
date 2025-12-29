import { Transport } from '../transport'

export interface IIntegration {
  init(transport: Transport): void
}

export class Integration implements IIntegration {
  transport: Transport | null = null
  constructor(private callback: () => void) {}

  init(transport: Transport) {
    this.transport = transport
  }
}

export interface MonitoringOptions {
  dsn: string
  integrations?: Integration[]
}
