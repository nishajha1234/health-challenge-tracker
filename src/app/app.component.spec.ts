import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WorkoutListComponent } from './workout-list/workout-list.component'; // Ensure this path is correct
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        WorkoutListComponent // Add this component to declarations
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Optionally include this to ignore unknown elements
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'health-challenge-tracker'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('health-challenge-tracker');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('health-challenge-tracker app is running!');
  });
});
