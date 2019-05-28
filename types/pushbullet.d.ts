declare enum DeviceIcon {
  desktop = 'desktop',
  browser = 'browser',
  website = 'website',
  laptop = 'laptop',
  tablet = 'tablet',
  phone = 'phone',
  watch = 'watch',
  system = 'system',
}

declare interface Push {
  active: boolean;
  created: number;
  direction: string;
  dismissed: boolean;
  guid: string;
  iden: string;
  modified: number;
  receiver_email_normalized: string;
  receiver_email: string;
  receiver_iden: string;
  sender_email_normalized: string;
  sender_email: string;
  sender_iden: string;
  sender_name: string;
  source_device_iden: string;
  target_device_iden: string;
  title: string;
  type: string;
  url: string;
}

declare interface Device {
  iden: string;
  active: boolean;
  created: number;
  modified: number;
  icon: DeviceIcon;
  nickname: string;
  generated_nickname: boolean;
  manufacturer: string;
  model: string;
  app_version: number;
  fingerprint: string;
  key_fingerprint: string;
  push_token: string;
  has_sms: boolean;
}

interface ConstructOptions {
  fullResponses?: boolean;
}

interface HistoryOptions {
  active?: boolean;
  cursor?: number;
  limit?: number;
  modified_after?: number;
}

interface DeviceOptions {
  nickname: string;
  model?: string;
  manufacturer?: string;
  push_token?: string;
  app_version?: number;
  icon?: DeviceIcon;
  has_sms?: boolean;
}

interface DevicesOptions {
  active: boolean;
  cursor: number;
  limit: number;
}

interface Stream {
  connect(): void;
  close(): void;
  on(event: 'connect', callback: () => void): void;
  on(event: 'close', callback: () => void): void;
  on(event: 'error', callback: (error: any) => void): void;
  on(event: 'message', callback: (message: any) => void): void;
  on(event: 'nop', callback: () => void): void;
  on(event: 'tickle', callback: (tickle: void) => void): void;
  on(event: 'push', callback: (push: Push) => void): void;
}

declare class Pushbullet {
  public constructor(apiKey?: string, options?: ConstructOptions);

  public history(options?: HistoryOptions): Promise<{ pushes: Push[] }>;

  public createDevice(deviceOptions: DeviceOptions): Promise<Device>;

  public devices(deviceOptions?: DevicesOptions): Promise<{ devices: Device[] }>;

  public note(deviceParams: string, title: string, body: string): Promise<Push>;

  // TODO: DEFINE!
  public stream(): any;
}

declare module 'pushbullet' {
  export = Pushbullet
}
