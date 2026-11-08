export type ChannelType = 'email' | 'sms' | 'push';

export interface OutgoingMessage {
  channel: ChannelType;
  recipient: string;
  length: number;
}
