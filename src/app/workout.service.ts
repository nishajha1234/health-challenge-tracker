import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workouts: any[] = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
  private workoutsSubject: BehaviorSubject<any[]> = new BehaviorSubject(this.workouts);

  constructor() {
    if (this.workouts.length === 0) {
      this.setInitialData();
    }
  }

  getWorkouts(): Observable<any[]> {
    return this.workoutsSubject.asObservable();
  }

  addWorkout(workout: any) {
    const exists = this.workouts.some(w => 
      w.name === workout.name && 
      w.workoutType === workout.workoutType && 
      w.minutes === workout.minutes
    );
    if (!exists) {
      this.workouts.unshift(workout);
      this.updateLocalStorage();
      this.workoutsSubject.next(this.workouts);
    }
  }

  deleteWorkout(workoutToDelete: any) {
    this.workouts = this.workouts.filter(workout => 
      !(workout.name === workoutToDelete.name && workout.workoutType === workoutToDelete.workoutType && workout.minutes === workoutToDelete.minutes)
    );
    this.updateLocalStorage();
    this.workoutsSubject.next(this.workouts);
  }

  updateWorkout(oldWorkout: any, updatedWorkout: any) {
    const index = this.workouts.findIndex(workout => 
      workout.name === oldWorkout.name && workout.workoutType === oldWorkout.workoutType && workout.minutes === oldWorkout.minutes
    );
    
    if (index !== -1) {
      this.workouts[index] = updatedWorkout;
      this.updateLocalStorage();
      this.workoutsSubject.next(this.workouts);
    }
  }

  private setInitialData() {
    this.workouts = [
      { name: 'John Doe', workoutType: 'Running', minutes: 30 },
      { name: 'John Doe', workoutType: 'Cycling', minutes: 45 },
      { name: 'Daniel Defoe', workoutType: 'Hiking', minutes: 60 },
      { name: 'Jane Smith', workoutType: 'Swimming', minutes: 20 },
      { name: 'Jane Smith', workoutType: 'Running', minutes: 60 },
      { name: 'Robin Cruise', workoutType: 'Weightlifting', minutes: 30 },
      { name: 'Mike Johnson', workoutType: 'Yoga', minutes: 50 },
      { name: 'Mike Johnson', workoutType: 'Cycling', minutes: 40 },
    ];
    console.log('Initial data set:', this.workouts);
    this.updateLocalStorage();
    this.workoutsSubject.next(this.workouts);
  }

  private updateLocalStorage() {
    localStorage.setItem('userWorkouts', JSON.stringify(this.workouts));
  }

  clearWorkouts() {
    this.workouts = [];
    this.updateLocalStorage();
    this.workoutsSubject.next(this.workouts);
  }
}
