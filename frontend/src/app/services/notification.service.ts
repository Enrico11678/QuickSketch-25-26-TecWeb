import { Injectable, signal } from '@angular/core';

export type NotificationType = 'error' | 'success' | 'info';

@Injectable({
  providedIn: 'root' 
})
export class NotificationService {
  private state = signal({ message: '', type: 'info' as NotificationType });
  data = this.state.asReadonly();

  show(msg: string, type: NotificationType = 'info') {
    this.state.set({ message: msg, type });
    if (type !== 'info') { // Info o conferme potrebbero restare più a lungo
      setTimeout(() => this.state.set({ message: '', type: 'info' }), 4000);
    }
  }
}