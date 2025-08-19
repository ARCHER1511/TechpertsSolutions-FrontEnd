import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Defines the structure for a chat message object
interface ChatMessage {
  senderId: string;
  message: string;
  sentAt: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  // Importing necessary Angular modules for the component to function
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    UpperCasePipe
  ],
  // The template and stylesheets are assumed to be in separate files
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  hubConnection!: signalR.HubConnection;
  connectionState: string = 'Disconnected';
  
  // NOTE: You will need a way to get the current user's ID
  // For demonstration, we'll use a placeholder variable.
  // Replace this with your actual user authentication logic.
  myUserId: string = 'userA';

  messages: ChatMessage[] = [];
  typingUser: string | null = null;
  newMessage: string = '';
  receiverUserId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribes to route parameter changes to get the receiver's user ID from the URL
    this.route.paramMap.subscribe(params => {
      this.receiverUserId = params.get('id') || '';
      if (this.receiverUserId) {
        this.startConnection();
      }
    });
  }

  ngOnDestroy(): void {
    // Disconnects from the SignalR hub when the component is destroyed
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  startConnection() {
    // Builds the SignalR hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7230/chat', {
        accessTokenFactory: () => localStorage.getItem('userToken') || ''
      })
      .withAutomaticReconnect()
      .build();

    // Event listeners for connection state changes
    this.hubConnection.onreconnecting(() => (this.connectionState = 'Reconnecting...'));
    this.hubConnection.onreconnected(() => (this.connectionState = 'Connected'));
    this.hubConnection.onclose(() => (this.connectionState = 'Disconnected'));

    // Starts the connection to the hub
    this.hubConnection
      .start()
      .then(() => {
        this.connectionState = 'Connected';
        console.log('✅ Connected to ChatHub');
        this.loadHistory();
      })
      .catch(err => console.error('❌ Error connecting to hub:', err));

    // Sets up the listener for receiving private messages
    this.hubConnection.on('ReceivePrivateMessage', (senderId: string, message: string) => {
      this.messages.push({
        senderId,
        message,
        sentAt: new Date()
      });
    });

    // Sets up the listener for the user typing event
    this.hubConnection.on('UserTyping', (senderId: string) => {
      // Only set the typing user if it's not the current user
      if (senderId !== this.myUserId) {
        this.typingUser = senderId;
        // Clears the typing indicator after 2 seconds
        setTimeout(() => (this.typingUser = null), 2000); 
      }
    });
  }

  loadHistory() {
    if (!this.receiverUserId) return;
    // Invokes a method on the hub to get message history
    this.hubConnection
      .invoke<ChatMessage[]>('GetMessageHistory', this.receiverUserId, 20)
      .then(history => {
        this.messages = history.reverse();
      })
      .catch(err => console.error('❌ Failed to load history:', err));
  }

  sendMessage() {
    // Sends the new message to the hub if it's not empty
    if (!this.newMessage.trim() || !this.receiverUserId) return;

    this.hubConnection
      .invoke('SendPrivateMessage', this.receiverUserId, this.newMessage)
      .catch(err => console.error('❌ Send error:', err));

    this.newMessage = ''; // Clears the input field after sending
  }

  sendTyping() {
    if (!this.receiverUserId) return;
    // Sends a typing notification to the hub
    this.hubConnection.invoke('SendTyping', this.receiverUserId).catch(() => {});
  }
}