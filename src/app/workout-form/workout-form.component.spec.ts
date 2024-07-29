import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../workout.service';
import { of } from 'rxjs';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let mockWorkoutService: { addWorkout: jasmine.Spy };

  beforeEach(() => {
    mockWorkoutService = {
      addWorkout: jasmine.createSpy('addWorkout').and.returnValue(of(true))
    };

    TestBed.configureTestingModule({
      declarations: [WorkoutFormComponent],
      imports: [FormsModule],
      providers: [
        { provide: WorkoutService, useValue: mockWorkoutService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addWorkout method with valid data', () => {
    const validWorkoutData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 30
    };
    component.userData = validWorkoutData;
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).toHaveBeenCalledWith(validWorkoutData);
  });

  it('should not call addWorkout if the name contains invalid characters', () => {
    component.userData.name = 'John123';
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.isValidName).toBeFalse();
  });

  it('should not call addWorkout if workout type is not selected', () => {
    component.userData.name = 'John Doe';
    component.userData.workoutType = ''; // No workout type selected
    component.userData.minutes = 30;
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });

  it('should toggle showOtherWorkoutField based on workout type selection', () => {
    component.onWorkoutTypeChange({ target: { value: 'Other' } });
    expect(component.showOtherWorkoutField).toBeTrue();

    component.onWorkoutTypeChange({ target: { value: 'Running' } });
    expect(component.showOtherWorkoutField).toBeFalse();
  });

  it('should reset form after successful submission', () => {
    const validWorkoutData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 30
    };
    component.userData = validWorkoutData;
    component.onSubmit();

    expect(component.userData).toEqual({ name: '', workoutType: '', otherWorkoutType: '', minutes: null });
  });

  it('should show an error message if the workout type is Other and otherWorkoutType is empty', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Other',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });

  it('should not call addWorkout if minutes is invalid', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: -10 // Invalid value
    };
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });

  it('should show an error if workoutType is Other but otherWorkoutType is empty', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Other',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });

  it('should not call addWorkout if all fields are empty', () => {
    component.userData = {
      name: '',
      workoutType: '',
      otherWorkoutType: '',
      minutes: null
    };
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });

  it('should not reset the form if there are validation errors', () => {
    component.userData = {
      name: '',
      workoutType: '',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();

    expect(component.userData).toEqual({
      name: '',
      workoutType: '',
      otherWorkoutType: '',
      minutes: 30
    });
  });

  it('should reset the form after a successful submission', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();

    // Check if form data is reset
    expect(component.userData).toEqual({
      name: '',
      workoutType: '',
      otherWorkoutType: '',
      minutes: null
    });
  });

  it('should handle different workout types correctly', () => {
    const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Hiking', 'Dancing', 'Other'];

    workoutTypes.forEach(type => {
      component.userData = {
        name: 'John Doe',
        workoutType: type,
        otherWorkoutType: type === 'Other' ? 'Custom Workout' : '',
        minutes: 30
      };
      component.onSubmit();

      expect(mockWorkoutService.addWorkout).toHaveBeenCalledWith({
        name: 'John Doe',
        workoutType: type,
        otherWorkoutType: type === 'Other' ? 'Custom Workout' : '',
        minutes: 30
      });
    });
  });

  it('should call addWorkout with otherWorkoutType when workoutType is Other', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Other',
      otherWorkoutType: 'Custom Workout',
      minutes: 30
    };

    fixture.detectChanges(); // Ensure the component updates before calling the method
    component.onSubmit();

    expect(mockWorkoutService.addWorkout).toHaveBeenCalledWith({
      name: 'John Doe',
      workoutType: 'Other',
      otherWorkoutType: 'Custom Workout',
      minutes: 30
    });
  });

  it('should validate name correctly', () => {
    component.onNameChange('John Doe');
    expect(component.isValidName).toBeTrue();
  
    component.onNameChange('John123');
    expect(component.isValidName).toBeFalse();
  });

  it('should set minutes correctly', () => {
    component.setMinutes(45);
    expect(component.userData.minutes).toBe(45);
  });
  
  it('should not call addWorkout if name is invalid', () => {
    component.userData = {
      name: 'InvalidName123',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();
  
    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.isValidName).toBeFalse();
  });
  
  it('should not call addWorkout if minutes is zero', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 0 // Invalid value
    };
    component.onSubmit();
  
    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });
  
  it('should show error if workoutType is "Other" but otherWorkoutType is empty', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Other',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();
  
    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  });
  
  it('should reset the form after successful submission', () => {
    component.userData = {
      name: 'John Doe',
      workoutType: 'Running',
      otherWorkoutType: '',
      minutes: 30
    };
    component.onSubmit();
  
    expect(component.userData).toEqual({
      name: '',
      workoutType: '',
      otherWorkoutType: '',
      minutes: null
    });
  });

  it('should toggle showOtherWorkoutField based on workout type selection', () => {
    component.onWorkoutTypeChange({ target: { value: 'Other' } });
    expect(component.showOtherWorkoutField).toBeTrue();
  
    component.onWorkoutTypeChange({ target: { value: 'Running' } });
    expect(component.showOtherWorkoutField).toBeFalse();
  });
  
  
});
