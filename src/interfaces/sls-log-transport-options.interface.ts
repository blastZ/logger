import { TransportStreamOptions } from "winston-transport";

export interface SlsLogTransportOptions extends TransportStreamOptions {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  apiVersion: string;
  projectName: string;
  logStoreName: string;
  topic?: string;
  source?: string;
  httpOptions?: {
    timeout: number; // default no timeout (ms)
  };
}
