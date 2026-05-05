import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { DriverService } from '../../services/driver.service';
import { TripService } from '../../services/trip.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
 username = '';
  isHomePage = true;
  stats = {
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    activeTrips: 0,
    completedTrips: 0
  };

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private tripService: TripService,
    private router: Router
  ) {
    const user = this.authService.currentUserValue;
    this.username = user?.username || 'User';

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/dashboard';
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    forkJoin({
      vehicles: this.vehicleService.getAllVehicles(),
      drivers: this.driverService.getAllDrivers(),
      trips: this.tripService.getAllTrips()
    }).subscribe({
      next: (data) => {
        this.stats.totalVehicles = data.vehicles.length;
        this.stats.activeVehicles = data.vehicles.filter(v => v.status === 'Active').length;
        this.stats.totalDrivers = data.drivers.length;
        this.stats.activeTrips = data.trips.filter(t => t.status === 'InProgress').length;
        this.stats.completedTrips = data.trips.filter(t => t.status === 'Completed').length;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
