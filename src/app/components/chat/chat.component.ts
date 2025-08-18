import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  senderId: string;
  message: string;
  sentAt: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true, // ✅ مهم علشان component يشتغل standalone
  imports: [
    CommonModule,   // ✅ يوفر *ngFor, *ngIf, ngClass
    FormsModule,    // ✅ يوفر [(ngModel)]
    DatePipe,       // ✅ يوفر date pipe
    UpperCasePipe   // ✅ يوفر uppercase pipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  hubConnection!: signalR.HubConnection;
  connectionState: string = 'Disconnected';

  messages: ChatMessage[] = [];
  typingUser: string | null = null;
  newMessage: string = '';
  receiverUserId: string = ''; // 👈 لازم يتحدد قبل الإرسال

  ngOnInit(): void {
    this.startConnection();
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  // ✅ Connect to SignalR Hub
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7230/chathub', {
        accessTokenFactory: () => localStorage.getItem('jwt') || ''
      })
      .withAutomaticReconnect()
      .build();

    // Connection state
    this.hubConnection.onreconnecting(() => (this.connectionState = 'Reconnecting...'));
    this.hubConnection.onreconnected(() => (this.connectionState = 'Connected'));
    this.hubConnection.onclose(() => (this.connectionState = 'Disconnected'));

    this.hubConnection
      .start()
      .then(() => {
        this.connectionState = 'Connected';
        console.log('✅ Connected to ChatHub');
        this.loadHistory();
      })
      .catch(err => console.error('❌ Error connecting to hub:', err));

    // 🔹 Listen for incoming messages
    this.hubConnection.on('ReceivePrivateMessage', (senderId: string, message: string) => {
      this.messages.push({
        senderId,
        message,
        sentAt: new Date()
      });
    });

    // 🔹 Listen for typing indicator
    this.hubConnection.on('UserTyping', (senderId: string) => {
      this.typingUser = senderId;
      setTimeout(() => (this.typingUser = null), 2000);
    });
  }

  // ✅ Load chat history
  loadHistory() {
    if (!this.receiverUserId) return;
    this.hubConnection
      .invoke<ChatMessage[]>('GetMessageHistory', this.receiverUserId, 20)
      .then(history => {
        this.messages = history.reverse(); // oldest first
      })
      .catch(err => console.error('❌ Failed to load history:', err));
  }

  // ✅ Send a message
  sendMessage() {
    if (!this.newMessage.trim() || !this.receiverUserId) return;

    this.hubConnection
      .invoke('SendPrivateMessage', this.receiverUserId, this.newMessage)
      .catch(err => console.error('❌ Send error:', err));

    this.newMessage = '';
  }

  // ✅ Notify receiver that user is typing
  sendTyping() {
    if (!this.receiverUserId) return;
    this.hubConnection.invoke('SendTyping', this.receiverUserId).catch(() => {});
  }
}