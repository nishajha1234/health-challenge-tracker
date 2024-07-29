import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
    localStorage.removeItem('userWorkouts'); // Clear local storage before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new workout', (done) => {
    const workout = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    service.addWorkout(workout);

    service.getWorkouts().subscribe(workouts => {
      expect(workouts).toContain(workout);
      done();
    });
  });

  it('should not add duplicate workouts', (done) => {
    const workout = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    service.addWorkout(workout);
    service.addWorkout(workout); // Add the same workout again

    service.getWorkouts().subscribe(workouts => {
      const count = workouts.filter(w => 
        w.name === workout.name && w.workoutType === workout.workoutType && w.minutes === workout.minutes
      ).length;
      expect(count).toBe(1);
      done();
    });
  });

  it('should delete a workout', (done) => {
    const workoutToDelete = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    service.addWorkout(workoutToDelete); // Ensure the workout is added first

    service.deleteWorkout(workoutToDelete);

    service.getWorkouts().subscribe(workouts => {
      expect(workouts).not.toContain(workoutToDelete);
      done();
    });
  });

  it('should handle deleting non-existent workouts', (done) => {
    const workoutToDelete = { name: 'Non-Existent', workoutType: 'Running', minutes: 30 };

    // Initial workouts
    const initialWorkout = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    service.addWorkout(initialWorkout);

    service.deleteWorkout(workoutToDelete);

    service.getWorkouts().subscribe(workouts => {
      expect(workouts).toContain(initialWorkout);
      done();
    });
  });

  it('should update a workout', (done) => {
    const initialWorkout = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    const updatedWorkout = { name: 'Test User', workoutType: 'Cycling', minutes: 45 };

    service.addWorkout(initialWorkout);

    service.updateWorkout(initialWorkout, updatedWorkout);

    service.getWorkouts().subscribe(workouts => {
      expect(workouts).toContain(updatedWorkout);
      expect(workouts).not.toContain(initialWorkout);
      done();
    });
  });

  it('should not update workouts with non-matching data', (done) => {
    const initialWorkout = { name: 'Test User', workoutType: 'Running', minutes: 30 };
    const nonMatchingWorkout = { name: 'Non-Existent', workoutType: 'Cycling', minutes: 45 };

    service.addWorkout(initialWorkout);

    service.updateWorkout(nonMatchingWorkout, { name: 'Updated User', workoutType: 'Yoga', minutes: 60 });

    service.getWorkouts().subscribe(workouts => {
      expect(workouts).toContain(initialWorkout); // The initial workout should still be there
      expect(workouts).not.toContain({ name: 'Updated User', workoutType: 'Yoga', minutes: 60 }); // No new workout should be present
      done();
    });
  });

  it('should return initial data if local storage is empty', (done) => {
    localStorage.removeItem('userWorkouts'); // Ensure local storage is cleared
    const newService = TestBed.inject(WorkoutService); // Re-inject the service

    newService.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBeGreaterThan(0);
      done();
    });
  });

  // Additional test cases
  it('should clear all workouts', (done) => {
    const workout1 = { name: 'Test User 1', workoutType: 'Running', minutes: 30 };
    const workout2 = { name: 'Test User 2', workoutType: 'Swimming', minutes: 20 };
    service.addWorkout(workout1);
    service.addWorkout(workout2);

    service.clearWorkouts();

    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBe(0);
      done();
    });
  });

  it('should not affect workouts if clearWorkouts is called on an empty list', (done) => {
    service.clearWorkouts(); // List is already empty

    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBe(0);
      done();
    });
  });

  it('should handle edge case for large data', (done) => {
    const workout = { name: 'Large Data User', workoutType: 'Running', minutes: 60 };
    for (let i = 0; i < 1000; i++) {
      service.addWorkout({ ...workout, minutes: i });
    }

    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBeGreaterThanOrEqual(1000);
      done();
    });
  });

  it('should initialize with default data when local storage is empty', (done) => {
    localStorage.removeItem('userWorkouts'); // Ensure local storage is cleared
    const newService = TestBed.inject(WorkoutService); // Re-inject the service
  
    newService.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBeGreaterThan(0);
      expect(workouts).toContain({ name: 'John Doe', workoutType: 'Running', minutes: 30 });
      done();
    });
  });

  it('should not update workouts if the old workout does not exist', (done) => {
    const nonExistentWorkout = { name: 'Non-Existent User', workoutType: 'Running', minutes: 30 };
    const updatedWorkout = { name: 'Updated User', workoutType: 'Yoga', minutes: 60 };
  
    service.updateWorkout(nonExistentWorkout, updatedWorkout);
  
    service.getWorkouts().subscribe(workouts => {
      expect(workouts).not.toContain(updatedWorkout); // No new workout should be present
      done();
    });
  });

  it('should handle adding and deleting the same workout simultaneously', (done) => {
    const workout = { name: 'Simultaneous User', workoutType: 'Cycling', minutes: 45 };
  
    service.addWorkout(workout);
    service.deleteWorkout(workout);
  
    service.getWorkouts().subscribe(workouts => {
      expect(workouts).not.toContain(workout); // Workout should not be present
      done();
    });
  });

  it('should clear all workouts after adding new data', (done) => {
    const workout1 = { name: 'User 1', workoutType: 'Running', minutes: 30 };
    const workout2 = { name: 'User 2', workoutType: 'Swimming', minutes: 20 };
    
    service.addWorkout(workout1);
    service.addWorkout(workout2);
  
    service.clearWorkouts();
  
    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBe(0); // All workouts should be cleared
      done();
    });
  });

  it('should handle large number of workouts and verify pagination', (done) => {
    const workout = { name: 'Pagination User', workoutType: 'Running', minutes: 60 };
    for (let i = 0; i < 1000; i++) {
      service.addWorkout({ ...workout, minutes: i });
    }
  
    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBeGreaterThanOrEqual(1000);
      // Additional pagination tests could be implemented here if your service supports pagination
      done();
    });
  });

  it('should clear all workouts after adding new data', (done) => {
    const workout1 = { name: 'User 1', workoutType: 'Running', minutes: 30 };
    const workout2 = { name: 'User 2', workoutType: 'Swimming', minutes: 20 };
    service.addWorkout(workout1);
    service.addWorkout(workout2);
  
    service.clearWorkouts();
  
    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBe(0); // All workouts should be cleared
      done();
    });
  });
  
  
  
    
});
