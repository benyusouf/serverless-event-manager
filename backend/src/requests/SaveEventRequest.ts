/**
 * Fields in a request to update a single event item.
 */
export interface SaveEventRequest {
  title: string;
  description: string;
  eventType: string;
  scheduledAt: string;
  venue: string;
}