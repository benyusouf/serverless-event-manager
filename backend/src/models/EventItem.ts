export interface EventItem {
  userId: string;
  id: string;
  createdAt: string;
  title: string;
  description: string;
  scheduledAt: string;
  done: boolean;
  attachmentUrl?: string;
  eventType: string;
}
