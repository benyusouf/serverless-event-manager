import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SaveEvent } from '../models/saveEvent.model';
import { Auth0Service } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  api = environment.api;
  authHeaderKey = 'Authorization';
  contentTypeHeaderKey = 'Content-Type';
  contentTypeHeaderValue = 'application/json';

  constructor(
    private _http: HttpClient,
    private _auth: Auth0Service
  ) { }

getEvents(): Observable<Event[]> {
  return this._http.get<Event[]>(`${this.api}/events`);
}

getUserEvents(): Observable<Event[]> {
  return this._http.get<Event[]>(`${this.api}/userevents`, {headers: this.getHeaders()});
}

createEvent(event: SaveEvent): Observable<Event> {
  return this._http.post<Event>(`${this.api}/events`, event, {headers: this.getHeaders()});
}

updateEvent(eventId: string, event: SaveEvent): Observable<Event>{
  return this._http.put<Event>(`${this.api}/events/${eventId}`, event, {headers: this.getHeaders()});
}

deleteEvent(eventId: string): Observable<void> {
  return this._http.delete<void>(`${this.api}/events/${eventId}`, {headers: this.getHeaders()});
}

uploadPhoto(uploadUrl: string, file: File): Observable<void>{
  return this._http.put<void>(uploadUrl, file);
}

getUploadUrl(eventId: string): Observable<string> {
  return this._http.post<string>(`${this.api}/events/${eventId}/attachment`, '', {headers: this.getHeaders()});
}

private getHeaders() {
  const accessKey = this._auth.getIdToken();
  console.log(accessKey);
  const headers = new HttpHeaders().append(this.authHeaderKey, `Bearer ${accessKey}`);
  headers.append(this.contentTypeHeaderKey, this.contentTypeHeaderValue);

  return headers;
}

}
