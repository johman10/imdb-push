interface Pusher {
  me: Function;
  devices: Function;
  createDevice: Function;
  updateDevice: Function;
  deleteDevice: Function;
  note: Function;
  link: Function;
  file: Function;
  dismissPush: Function;
  deletePush: Function;
  deleteAllPushes: Function;
  history: Function;
  subscriptions: Function;
  subscribe: Function;
  unsubscribe: Function;
  muteSubscription: Function;
  unmuteSubscription: Function;
  channelInfo: Function;
  chats: Function;
  createChat: Function;
  deleteChat: Function;
  muteChat: Function;
  unmuteChat: Function;
  sendSMS: Function;
  sendClipboard: Function;
  dismissEphemeral: Function;
  stream: Function;
  enableEncryption: Function;
}

interface Push {
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

interface Device {
  active: boolean;
  app_version: number;
  created: number;
  iden: string;
  manufacturer: string;
  model: string;
  modified: number;
  nickname: string;
  push_token: string;
}
