import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Register } from './components/register/register';
import { Vehicles } from './components/vehicles/vehicles';
import { Drivers } from './components/drivers/drivers';
import { Trips } from './components/trips/trips';
import { Notifications } from './components/notifications/notifications';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
   /*  {path:'',component:Login},
  
      { path: 'login', redirectTo: '', pathMatch: 'full' },
          {path:'dashboard',component:Dashboard},
              {path:'register',component:Register},
                   {path:'vehicles',component:Vehicles},
                      {path:'drivers',component:Drivers},
                            {path:'trips',component:Trips},
                                 {path:'notifications',component:Notifications},
  { path: '**', redirectTo: '' } */
   { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {path:'dashboard',component:Dashboard},
      { path: 'vehicles', component: Vehicles },
      { path: 'drivers', component: Drivers },
      { path: 'trips', component: Trips},
      { path: 'notifications', component: Notifications }
    ]
  },
  { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];
