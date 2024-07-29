import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from '../workout.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getWorkouts']);

    await TestBed.configureTestingModule({
      declarations: [ WorkoutListComponent ],
      providers: [ { provide: WorkoutService, useValue: workoutServiceSpy } ],
      schemas: [NO_ERRORS_SCHEMA] // To avoid errors about unrecognized elements in the component's template
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load workouts on init', () => {
    const mockWorkouts = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Yoga', workoutType: 'Yoga', minutes: 45 }
    ];
    workoutService.getWorkouts.and.returnValue(of(mockWorkouts));

    // Create spies for methods to be called
    spyOn(component, 'extractWorkoutTypes').and.callThrough();
    spyOn(component, 'applyFilters').and.callThrough();

    component.ngOnInit();

    expect(workoutService.getWorkouts).toHaveBeenCalled();
    expect(component.workouts).toEqual(mockWorkouts);
    expect(component.extractWorkoutTypes).toHaveBeenCalled();
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should handle errors when loading workouts', () => {
    workoutService.getWorkouts.and.returnValue(throwError('Error'));

    component.loadWorkouts();

    expect(component.errorMessage).toBe('There was a problem loading workouts. Please try again later.');
  });

  it('should extract workout types correctly', () => {
    component.workouts = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Yoga', workoutType: 'Yoga', minutes: 45 }
    ];

    component.extractWorkoutTypes();

    expect(component.workoutTypes).toEqual(['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Hiking', 'Dancing', 'Other']);
  });

  it('should apply filters correctly', () => {
    component.workouts = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Yoga', workoutType: 'Yoga', minutes: 45 }
    ];
    component.searchQuery = 'Running';
    component.filterType = 'Running';

    component.applyFilters();

    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].name).toBe('Running');
  });

  it('should handle no results in applyFilters', () => {
    component.workouts = [];
    component.searchQuery = 'Nonexistent';
    component.filterType = '';
  
    component.applyFilters();
  
    expect(component.errorMessage).toBe('No results found for the current filters.');
  });
  

  it('should aggregate workouts correctly', () => {
    const workouts = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Running', workoutType: 'Cycling', minutes: 20 }
    ];

    const aggregated = component.aggregateWorkouts(workouts);

    expect(aggregated.length).toBe(1);
    expect(aggregated[0].name).toBe('Running');
    expect(aggregated[0].numberOfWorkouts).toBe(2);
    expect(aggregated[0].workouts).toBe('Running, Cycling');
    expect(aggregated[0].totalMinutes).toBe(50);
  });

  it('should paginate data correctly', () => {
    const data = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Yoga', workoutType: 'Yoga', minutes: 45 },
      { name: 'Cycling', workoutType: 'Cycling', minutes: 60 }
    ];
    component.pageSize = 2;
    component.currentPage = 1;

    const paginated = component.paginate(data);

    expect(paginated.length).toBe(2);
    expect(paginated[0].name).toBe('Running');
    expect(paginated[1].name).toBe('Yoga');
  });

  it('should change page on onPageChange', (done) => {
    // Set default values
    component.pageSize = 5; // Default page size
    component.currentPage = 1; // Start at page 1
  
    // Mock data for testing pagination
    const mockWorkouts = [
      { name: 'Running', workoutType: 'Running', minutes: 30 },
      { name: 'Yoga', workoutType: 'Yoga', minutes: 45 },
      { name: 'Cycling', workoutType: 'Cycling', minutes: 60 },
      { name: 'Swimming', workoutType: 'Swimming', minutes: 25 },
      { name: 'Hiking', workoutType: 'Hiking', minutes: 40 },
      { name: 'Weightlifting', workoutType: 'Weightlifting', minutes: 35 }
    ];
  
    workoutService.getWorkouts.and.returnValue(of(mockWorkouts));
    
    // Load the workouts
    component.loadWorkouts();
  
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure view updates
  
      // Spy on applyFilters method
      const applyFiltersSpy = spyOn(component, 'applyFilters').and.callThrough();
  
      // Change page
      component.onPageChange(2); // Go to page 2
  
      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Ensure view updates
  
        // Check if the currentPage has been updated
        expect(component.currentPage).toBe(2);
  
        // Ensure applyFilters has been called
        expect(applyFiltersSpy).toHaveBeenCalled();
  
        // Check paginated results
        expect(component.paginatedWorkouts.length).toBe(1); // Expecting only one item on the second page with default page size
  
        done();
      }).catch(done.fail); // Handle any errors in the promise
    }).catch(done.fail); // Handle any errors in the promise
  });
  
  
  
  
  it('should handle page size change on onPageSizeChange', () => {
    spyOn(component, 'applyFilters').and.callThrough();
    component.pageSize = 5;

    component.onPageSizeChange(3);

    expect(component.pageSize).toBe(3);
    expect(component.currentPage).toBe(1);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should determine total pages correctly', () => {
    component.totalItems = 15;
    component.pageSize = 5;

    const totalPages = component.totalPages();

    expect(totalPages).toBe(3);
  });

  it('should determine hasPreviousPage correctly', () => {
    component.currentPage = 2;

    expect(component.hasPreviousPage()).toBeTrue();
  });

  it('should determine hasNextPage correctly', () => {
    component.currentPage = 1;
    component.totalItems = 15;
    component.pageSize = 5;

    expect(component.hasNextPage()).toBeTrue();
  });

  it('should get page numbers correctly', () => {
    component.totalItems = 15;
    component.pageSize = 5;

    const pageNumbers = component.getPageNumbers();

    expect(pageNumbers).toEqual([1, 2, 3]);
  });

  it('should reset currentPage to 1 and call applyFilters on search change', () => {
    spyOn(component, 'applyFilters'); // Spy on the applyFilters method

    component.onSearchChange();

    expect(component.currentPage).toBe(1);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should reset currentPage to 1 and call applyFilters on filter change', () => {
    spyOn(component, 'applyFilters'); // Spy on the applyFilters method

    component.onFilterChange();

    expect(component.currentPage).toBe(1);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  
});
