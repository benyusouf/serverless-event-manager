import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SaveEvent } from '../models/saveEvent.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  api = environment.api;
  authHeaderKey = 'Authorization';
  contentTypeHeaderKey = 'Content-Type';
  contentTypeHeaderValue = 'application/json';

  constructor(
    private _http: HttpClient
  ) { }

getEvents(): Observable<any> {
  return this._http.get<any>(`${this.api}/events`);
}

getUserEvents(token: string): Observable<any> {
  return this._http.get<any>(`${this.api}/userevents`, {headers: this.getHeaders(token)});
}

getEvent(id: string, userId: string): Observable<any> {
  const params = this.toHttpParams({userId: userId, eventId: id});
  return this._http.get<any>(`${this.api}/event`, {params : params});
}

createEvent(event: SaveEvent, token: string): Observable<Event> {
  return this._http.post<Event>(`${this.api}/events`, event, {headers: this.getHeaders(token)});
}

updateEvent(eventId: string, event: SaveEvent, token: string): Observable<Event>{
  return this._http.patch<Event>(`${this.api}/events/${eventId}`, event, {headers: this.getHeaders(token)});
}

deleteEvent(eventId: string, token: string): Observable<void> {
  return this._http.delete<void>(`${this.api}/events/${eventId}`, {headers: this.getHeaders(token)});
}

uploadPhoto(uploadUrl: string, file: File): Observable<void>{
  return this._http.put<void>(uploadUrl, file);
}

getUploadUrl(eventId: string, token: string): Observable<any> {
  return this._http.post<any>(`${this.api}/events/${eventId}/attachment`, '', {headers: this.getHeaders(token)});
}

private getHeaders(token: string) {
  const headers = new HttpHeaders().append(this.authHeaderKey, `Bearer ${token}`);
  headers.append(this.contentTypeHeaderKey, this.contentTypeHeaderValue);

  return headers;
}

  private toHttpParams(params) {
    return Object.getOwnPropertyNames(params)
    .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }

}
