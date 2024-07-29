import { Component } from '@angular/core';
import { WorkoutService } from '../workout.service';


@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent {
  userData = {
    name: '',
    workoutType: '',
    otherWorkoutType: '',
    minutes: null as number | null
  };

  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Hiking', 'Dancing'];
  showError: boolean = false;
  showOtherWorkoutField: boolean = false;
  isValidName: boolean = true;

  constructor(private workoutService: WorkoutService) {} // Inject WorkoutService

  onSubmit() {
    this.showError = true;

    // Validate user name
    this.isValidName = /^[a-zA-Z ]*$/.test(this.userData.name);

    // Validation check
    if (
      this.isValidName &&
      this.userData.name &&
      (this.userData.workoutType && (this.userData.workoutType !== 'Other' || this.userData.otherWorkoutType)) &&
      this.userData.minutes && this.userData.minutes > 0
    ) {
      // Add workout using the service
      this.workoutService.addWorkout(this.userData);

      // Reset form
      this.userData = {
        name: '',
        workoutType: '',
        otherWorkoutType: '',
        minutes: null
      };
      this.showError = false;
      this.showOtherWorkoutField = false;
    }
  }

  onWorkoutTypeChange(event: any) {
    this.showOtherWorkoutField = event.target.value === 'Other';
  }

  onNameChange(value: string) {
    this.isValidName = /^[a-zA-Z ]*$/.test(value);
  }

  setMinutes(minutes: number) {
    this.userData.minutes = minutes;
  }
}
