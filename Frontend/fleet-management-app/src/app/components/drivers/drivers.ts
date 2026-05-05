import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-drivers',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drivers.html',
  styleUrl: './drivers.css',
})
export class Drivers {
 drivers: Driver[] = [];
  driverForm: FormGroup;
  showAddForm = false;
  editingDriver: Driver | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService
  ) {
    this.driverForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['Active', Validators.required],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        this.error = 'Failed to load drivers';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.driverForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.driverForm.value;

    if (this.editingDriver) {
      this.driverService.updateDriver(this.editingDriver.id, formData).subscribe({
        next: () => {
          this.success = 'Driver updated successfully';
          this.loadDrivers();
          this.resetForm();
        },
        error: (error) => {
          this.error = 'Failed to update driver';
          this.loading = false;
        }
      });
    } else {
      this.driverService.createDriver(formData).subscribe({
        next: () => {
          this.success = 'Driver added successfully';
          this.loadDrivers();
          this.resetForm();
        },
        error: (error) => {
          this.error = 'Failed to add driver';
          this.loading = false;
        }
      });
    }
  }

  editDriver(driver: Driver): void {
    this.editingDriver = driver;
    this.showAddForm = true;
    const hireDate = new Date(driver.hireDate);
    const formattedDate = hireDate.toISOString().split('T')[0];
    this.driverForm.patchValue({
      ...driver,
      hireDate: formattedDate
    });
  }

  deleteDriver(id: string): void {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    this.driverService.deleteDriver(id).subscribe({
      next: () => {
        this.success = 'Driver deleted successfully';
        this.loadDrivers();
      },
      error: (error) => {
        this.error = 'Failed to delete driver';
      }
    });
  }

  resetForm(): void {
    this.driverForm.reset({ status: 'Active' });
    this.editingDriver = null;
    this.showAddForm = false;
    this.loading = false;
  }
}
