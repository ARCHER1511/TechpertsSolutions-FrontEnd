import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, ConnectionState, ChatService } from '../../Services/chat.service';
import { CommonModule } from '@angular/common'; // ngIf, ngFor, pipes
import { FormsModule } from '@angular/forms';   // ngModel

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  connectionState: ConnectionState = 'disconnected';
  typingUser: string | null = null;

  receiverUserId: string = ''; // dynamically set
  newMessage: string = '';

  private subs: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Start SignalR connection (service will read token from localStorage)
    this.chatService.startConnection();

    // Subscribe to reactive streams
    this.subs.push(
      this.chatService.messages$.subscribe(msgs => this.messages = msgs),
      this.chatService.connectionState$.subscribe(state => this.connectionState = state),
      this.chatService.typing$.subscribe(user => this.typingUser = user)
    );
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    if (!this.receiverUserId) return;

    this.chatService.sendPrivateMessage(this.receiverUserId, this.newMessage);
    this.newMessage = '';
  }

  sendTyping(): void {
    if (this.receiverUserId) {
      this.chatService.sendTyping(this.receiverUserId);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.chatService.stopConnection();
  }
}
