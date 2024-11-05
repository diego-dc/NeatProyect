import { DashboardFirebaseService } from './../../services/dashboardFirebase/dashboard-firebase.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  DashboardFirebaseService = inject(DashboardFirebaseService);

  ngOnInit(): void {
    this.DashboardFirebaseService.getDashboardData().subscribe((data) => {
      console.log(data);
    });
  }
}
