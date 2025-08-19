import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NotificationDTO,CreateNotificationDTO, NotificationCountDTO, NotificationType, SendToMultipleUsersNotificationDTO } from '../Interfaces/inotification';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RoleType } from '../Interfaces/iadmin-user-management';
import { Environment } from '../Environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { GeneralResponse } from '../Interfaces/iorder';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${Environment.baseUrl}/Notification`;
  private isBrowser: boolean;
  private id: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.id = localStorage.getItem('userId');
    }
  }

  /** Get token from localStorage (SSR safe) */
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getMyNotifications(pageNumber = 1, pageSize = 20): Observable<GeneralResponse<NotificationDTO[]>> {
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  return this.http.get<GeneralResponse<NotificationDTO[]>>(
    `${this.apiUrl}/user/${this.id}`,
    {
      params,
      headers: this.getAuthHeaders()
    }
  )
}


  getNotificationCount(): Observable<NotificationCountDTO> {
    return this.http.get<NotificationCountDTO>(`${this.apiUrl}/count`, {
      headers: this.getAuthHeaders()
    });
  }

  getNotificationById(notificationId: string): Observable<NotificationDTO> {
    return this.http.get<NotificationDTO>(`${this.apiUrl}/${notificationId}`, {
      headers: this.getAuthHeaders()
    });
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-read/${notificationId}`, null, {
      headers: this.getAuthHeaders()
    });
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-all-read`, null, {
      headers: this.getAuthHeaders()
    });
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`, {
      headers: this.getAuthHeaders()
    });
  }

  sendNotification(dto: CreateNotificationDTO, type: NotificationType, receiverUserId: string): Observable<any> {
    let params = new HttpParams().set('type', type.toString());
    return this.http.post(`${this.apiUrl}/send/${receiverUserId}`, dto, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  sendNotificationToRole(message: string, roleType: RoleType, type: NotificationType, relatedEntityId?: string, relatedEntityType?: string): Observable<any> {
    let params = new HttpParams()
      .set('roleType', roleType.toString())
      .set('type', type.toString());

    if (relatedEntityId) {
      params = params.set('relatedEntityId', relatedEntityId);
    }
    if (relatedEntityType) {
      params = params.set('relatedEntityType', relatedEntityType);
    }

    return this.http.post(`${this.apiUrl}/send/role`, message, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  sendNotificationToMultipleUsers(dto: SendToMultipleUsersNotificationDTO, type: NotificationType): Observable<any> {
    let params = new HttpParams().set('type', type.toString());
    return this.http.post(`${this.apiUrl}/send/multiple`, dto, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
