import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

getEvents(): Observable<any> {
  return this._http.get<any>(`${this.api}/events`);
}

getUserEvents(): Observable<any> {
  return this._http.get<any>(`${this.api}/userevents`, {headers: this.getHeaders()});
}

getEvent(id: string, userId: string): Observable<any> {
  const params = this.toHttpParams({userId: userId, eventId: id});
  console.log(id);
  return this._http.get<any>(`${this.api}/event`, {params : params});
}

createEvent(event: SaveEvent): Observable<Event> {
  return this._http.post<Event>(`${this.api}/events`, event, {headers: this.getHeaders()});
}

updateEvent(eventId: string, event: SaveEvent): Observable<Event>{
  return this._http.patch<Event>(`${this.api}/events/${eventId}`, event, {headers: this.getHeaders()});
}

deleteEvent(eventId: string): Observable<void> {
  return this._http.delete<void>(`${this.api}/events/${eventId}`, {headers: this.getHeaders()});
}

uploadPhoto(uploadUrl: string, file: File): Observable<void>{
  return this._http.put<void>(uploadUrl, file);
}

getUploadUrl(eventId: string): Observable<any> {
  return this._http.post<any>(`${this.api}/events/${eventId}/attachment`, '', {headers: this.getHeaders()});
}

private getHeaders() {
  this._auth.renewSession();
  const accessKey = this._auth.getIdToken();
  console.log(accessKey);
  const headers = new HttpHeaders().append(this.authHeaderKey, `Bearer ${accessKey}`);
  headers.append(this.contentTypeHeaderKey, this.contentTypeHeaderValue);

  return headers;
}

  private toHttpParams(params) {
    return Object.getOwnPropertyNames(params)
    .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }

}
