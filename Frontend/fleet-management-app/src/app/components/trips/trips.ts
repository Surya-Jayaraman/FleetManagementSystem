import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { VehicleService } from '../../services/vehicle.service';
import { DriverService } from '../../services/driver.service';
import { Trip } from '../../models/trip.model';
import { Vehicle } from '../../models/vehicle.model';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-trips',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trips.html',
  styleUrl: './trips.css',
})
export class Trips {

  trips: Trip[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  tripForm: FormGroup;
  endTripForm: FormGroup;
  showAddForm = false;
  endingTrip: Trip | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private vehicleService: VehicleService,
    private driverService: DriverService
  ) {
    this.tripForm = this.fb.group({
      vehicleID: ['', Validators.required],
      driverID: ['', Validators.required],
      startLocation: ['', Validators.required]
    });

    this.endTripForm = this.fb.group({
      endLocation: ['', Validators.required],
      distanceTraveled: [0, Validators.required],
      averageSpeed: [0, Validators.required],
      maxSpeed: [0, Validators.required],
      fuelConsumed: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTrips();
    this.loadVehicles();
    this.loadDrivers();
  }

  loadTrips(): void {
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        this.trips = data.sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      },
      error: (error) => {
        this.error = 'Failed to load trips';
        console.error(error);
      }
    });
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Failed to load vehicles', error);
      }
    });
  }

  loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
        console.log(this.drivers)
      },
      error: (error) => {
        console.error('Failed to load drivers', error);
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.tripService.createTrip(this.tripForm.value).subscribe({
      next: () => {
        this.success = 'Trip started successfully';
        this.loadTrips();
        this.resetForm();
      },
      error: (error) => {
        this.error = 'Failed to start trip';
        this.loading = false;
      }
    });
  }

  showEndTripForm(trip: Trip): void {
    this.endingTrip = trip;
    this.endTripForm.reset();
  }

  endTrip(): void {
    if (this.endTripForm.invalid || !this.endingTrip) return;

    this.loading = true;
    this.error = '';

    this.tripService.endTrip(this.endingTrip.tripID, this.endTripForm.value).subscribe({
      next: () => {
        this.success = 'Trip ended successfully';
        this.loadTrips();
        this.cancelEndTrip();
      },
      error: (error) => {
        this.error = 'Failed to end trip';
        this.loading = false;
      }
    });
  }

  cancelEndTrip(): void {
    this.endingTrip = null;
    this.endTripForm.reset();
    this.loading = false;
  }

  resetForm(): void {
    this.tripForm.reset();
    this.showAddForm = false;
    this.loading = false;
  }


}
