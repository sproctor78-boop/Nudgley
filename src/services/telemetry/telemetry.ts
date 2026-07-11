export interface Telemetry { event(name: string, props?: Record<string, unknown>): void; error(error: unknown, context?: Record<string, unknown>): void; }
export const noopTelemetry: Telemetry = { event: () => undefined, error: () => undefined };
