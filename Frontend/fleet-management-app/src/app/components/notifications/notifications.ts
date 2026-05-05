import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification, NotificationStats } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {

notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  stats: NotificationStats | null = null;
  selectedSource: string = 'all';
  error: string = '';
  loading: boolean = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadStats();
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = '';
    
    this.notificationService.getAllNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notifications. Make sure AlertService is running.';
        console.error('Error loading notifications:', err);
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.notificationService.getNotificationStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  filterBySource(source: string): void {
    this.selectedSource = source;
    
    if (source === 'all') {
      this.loadNotifications();
    } else {
      this.loading = true;
      this.error = '';
      
      this.notificationService.getNotificationsBySource(source).subscribe({
        next: (data) => {
          console.log(source)
          console.log(data)
          this.notifications = data;
          this.filteredNotifications = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = `Failed to load ${source} notifications.`;
          console.error('Error filtering notifications:', err);
          this.loading = false;
        }
      });
    }
  }

  applyFilter(): void {
    if (this.selectedSource === 'all') {
      this.filteredNotifications = this.notifications;
    } else {
      this.filteredNotifications = this.notifications.filter(
        n => n.source.toLowerCase() === this.selectedSource.toLowerCase()
      );
    }
  }

  formatPayload(payload: string): string {
    try {
      return JSON.stringify(JSON.parse(payload), null, 2);
    } catch {
      return payload;
    }
  }
}
