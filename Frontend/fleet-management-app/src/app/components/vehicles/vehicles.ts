import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle, CreateVehicleRequest } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css',
})
export class Vehicles {

 vehicles: Vehicle[] = [];
  vehicleForm: FormGroup;
  showAddForm = false;
  editingVehicle: Vehicle | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService
  ) {
    this.vehicleForm = this.fb.group({
      licensePlate: ['', Validators.required],
      model: ['', Validators.required],
      status: ['Active', Validators.required],
      lastKnownLocation: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      currentSpeed: [0],
      fuelLevel: [100]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        this.error = 'Failed to load vehicles';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData: CreateVehicleRequest = this.vehicleForm.value;

    if (this.editingVehicle) {
      this.vehicleService.updateVehicle(this.editingVehicle.vehicleID, formData).subscribe({
        next: () => {
          this.success = 'Vehicle updated successfully';
          this.loadVehicles();
          this.resetForm();
        },
        error: (error) => {
          this.error = 'Failed to update vehicle';
          this.loading = false;
        }
      });
    } else {
      this.vehicleService.createVehicle(formData).subscribe({
        next: () => {
          this.success = 'Vehicle added successfully';
          this.loadVehicles();
          this.resetForm();
        },
        error: (error) => {
          this.error = 'Failed to add vehicle';
          this.loading = false;
        }
      });
    }
  }

  editVehicle(vehicle: Vehicle): void {
    this.editingVehicle = vehicle;
    this.showAddForm = true;
    this.vehicleForm.patchValue(vehicle);
  }

  deleteVehicle(id: string): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.success = 'Vehicle deleted successfully';
        this.loadVehicles();
      },
      error: (error) => {
        this.error = 'Failed to delete vehicle';
      }
    });
  }

  resetForm(): void {
    this.vehicleForm.reset({ status: 'Active', currentSpeed: 0, fuelLevel: 100 });
    this.editingVehicle = null;
    this.showAddForm = false;
    this.loading = false;
  }
}
