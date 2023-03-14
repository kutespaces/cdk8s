import * as vscode from 'vscode';
import { Logger } from './log';

export const setupTelemetry = (log: Logger) => {
  if(!('createTelemetryLogger' in vscode.env)) {
    log.info('Not enabling telemetry logger, VSCode < v1.75.0');
    return;
  }
  vscode.env.createTelemetryLogger({
    sendEventData: function (eventName: string, data?: Record<string, any> | undefined): void {
      log.info(`VSCode Telemetry Event: ${eventName}`, data);
    },
    sendErrorData: function (error: Error, data?: Record<string, any> | undefined): void {
      log.error(`VSCode Error Event: ${error}`, data);
    }
  }, {});
};
