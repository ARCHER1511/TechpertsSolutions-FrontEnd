import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface ChatMessage {
  senderId: string;
  message: string;
  sentAt: Date;
}

export type ConnectionState =
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error'
  | 'connecting';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private hubConnection!: signalR.HubConnection;
  private _baseUrl = Environment.baseUrl;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private connectionStateSubject = new BehaviorSubject<ConnectionState>('disconnected');
  connectionState$ = this.connectionStateSubject.asObservable();

  private typingSubject = new BehaviorSubject<string | null>(null);
  typing$ = this.typingSubject.asObservable();

  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 2000;

  private tokenCheckInterval: any;

  constructor() {}

  public startConnection(): void {
    this.connectionStateSubject.next('connecting');

    const token = this.getToken();
    if (!token) {
      console.error('❌ No token found. Cannot connect to ChatHub.');
      this.connectionStateSubject.next('disconnected');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this._baseUrl}/Chat`, {
        accessTokenFactory: () => this.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();

    this.registerHubEvents();
    this.tryStart();

    // Monitor token changes every 5 seconds
    this.tokenCheckInterval = setInterval(() => {
      const currentToken = this.getToken();
      if (!currentToken || currentToken !== token) {
        console.log('🔄 Token changed, restarting connection...');
        this.restartConnection();
      }
    }, 5000);
  }

  private registerHubEvents(): void {
    this.hubConnection.onreconnecting(() => {
      console.warn('⚠️ Reconnecting to ChatHub...');
      this.connectionStateSubject.next('reconnecting');
    });

    this.hubConnection.onclose(() => {
      console.warn('❎ Disconnected from ChatHub');
      this.connectionStateSubject.next('disconnected');
      this.clearMessages();
    });

    this.hubConnection.on('ReceivePrivateMessage', (senderId: string, message: string) => {
      this.addMessage({ senderId, message, sentAt: new Date() });
    });

    this.hubConnection.on('UserTyping', (senderId: string) => {
      this.typingSubject.next(senderId);
      setTimeout(() => this.typingSubject.next(null), 3000);
    });
  }

  private tryStart(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ Connected to ChatHub');
        this.retryCount = 0;
        this.connectionStateSubject.next('connected');
      })
      .catch(err => {
        console.error(`❌ Connection failed (attempt ${this.retryCount + 1}):`, err);
        this.connectionStateSubject.next('error');

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);
          console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
          setTimeout(() => this.tryStart(), delay);
        } else {
          console.error('❌ Max retry attempts reached. Giving up.');
        }
      });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => this.connectionStateSubject.next('disconnected'))
        .catch(err => console.error('❌ Error disconnecting:', err));
    }

    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  private restartConnection(): void {
    this.stopConnection();
    this.startConnection();
  }

  public sendPrivateMessage(receiverUserId: string, message: string): void {
    this.hubConnection.invoke('SendPrivateMessage', receiverUserId, message)
      .catch(err => console.error('❌ Send failed:', err));
  }

  public sendTyping(receiverUserId: string): void {
    this.hubConnection.invoke('SendTyping', receiverUserId)
      .catch(err => console.error('❌ Typing send failed:', err));
  }

  private addMessage(msg: ChatMessage): void {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, msg]);
  }

  private clearMessages(): void {
    this.messagesSubject.next([]);
  }

  private getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}