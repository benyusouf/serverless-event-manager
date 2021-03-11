import { EventItem } from "../models/EventItem";
import { EventRepository } from "../infrastructure/EventRepository";
import { parseUserId } from "../auth/utils";
import { SaveEventRequest } from "../requests/SaveEventRequest";
import { EventUpdate } from "../models/EventUpdate";

const uuidv4 = require('uuid/v4');
const repo = new EventRepository();

export async function getUserEvents(jwtToken: string): Promise<EventItem[]> {
    const userId = parseUserId(jwtToken);
    return repo.getUserEvents(userId);
}

export async function getEvents(): Promise<EventItem[]> {
    return repo.getEvents();
}

export function createEvent(createEventRequest: SaveEventRequest, jwtToken: string): Promise<EventItem> {
    const userId = parseUserId(jwtToken);
    return repo.createEvent({
        userId: userId,
        id: uuidv4(),
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createEventRequest
    });
}

export function updateEvent(updateEventRequest: SaveEventRequest, eventId: string, jwtToken: string): Promise<EventUpdate> {
    const userId = parseUserId(jwtToken);
    return repo.updateEvent(updateEventRequest, eventId, userId);
}

export function deleteEvent(eventId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return repo.deleteEvent(eventId, userId);
}

export function getSignedUrl(eventId: string): Promise<string> {
    return repo.getSignedUrl(eventId);
}

export function updateEventAttachmentUrl(eventId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return repo.updateEventAttachmentUrl(eventId, userId);
}