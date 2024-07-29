import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit, OnDestroy {
  workouts: any[] = [];
  paginatedWorkouts: any[] = [];
  searchQuery: string = '';
  filterType: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  workoutTypes: string[] = [];
  allWorkoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Hiking', 'Dancing', 'Other'];
  errorMessage: string | null = null;
  totalItems: number = 0;

  private workoutsSub: Subscription = new Subscription();

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.loadWorkouts();
  }

  ngOnDestroy() {
    this.workoutsSub.unsubscribe();
  }

  loadWorkouts() {
    // Subscribe to the observable to get the data
    this.workoutsSub = this.workoutService.getWorkouts().subscribe(
      (workouts: any[]) => {
        this.workouts = workouts;
        this.extractWorkoutTypes();
        this.applyFilters();
      },
      error => {
        console.error('Error loading workouts:', error);
        this.errorMessage = 'There was a problem loading workouts. Please try again later.';
      }
    );
  }

  extractWorkoutTypes() {
    this.workoutTypes = Array.from(new Set([...this.allWorkoutTypes, ...this.workouts.map(w => w.workoutType)]));
  }

  applyFilters() {
    this.errorMessage = null;
    let filtered = this.workouts
      .filter(workout => workout.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .filter(workout => this.filterType === '' || workout.workoutType === this.filterType);
  
    if (filtered.length === 0) {
      this.errorMessage = this.searchQuery || this.filterType
        ? 'No results found for the current filters.'
        : 'No data available.';
    }
  
    const aggregated = this.aggregateWorkouts(filtered);
    this.totalItems = aggregated.length;
    this.paginatedWorkouts = this.paginate(aggregated);
  }
  

  aggregateWorkouts(workouts: any[]) {
    const grouped = workouts.reduce((acc: any, workout) => {
      if (!acc[workout.name]) {
        acc[workout.name] = {
          name: workout.name,
          workouts: [],
          totalMinutes: 0
        };
      }
      acc[workout.name].workouts.push(workout.workoutType);
      acc[workout.name].totalMinutes += workout.minutes;
      return acc;
    }, {});

    return Object.values(grouped).map((item: any) => ({
      ...item,
      numberOfWorkouts: item.workouts.length,
      workouts: item.workouts.join(', ')
    }));
  }

  paginate(data: any[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return data.slice(start, end);
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page on search
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1; // Reset to first page on filter change
    this.applyFilters();
  }

  onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage = page;
      this.applyFilters(); 
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page when page size changes
    this.applyFilters(); // Reapply filters and update pagination
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }
}
