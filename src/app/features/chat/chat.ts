import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { SupportMessage, SupportService } from '../../core/support';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  private supportService = inject(SupportService);

  messages = signal<SupportMessage[]>([]);
  newMessage = '';
  sending = signal(false);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.supportService.getMessages().subscribe((messages) => this.messages.set(messages));
  }

  send(): void {
    if (!this.newMessage.trim()) return;

    this.sending.set(true);
    this.supportService.sendMessage(this.newMessage).subscribe(() => {
      this.newMessage = '';
      this.sending.set(false);
      this.loadMessages();
    });
  }
}