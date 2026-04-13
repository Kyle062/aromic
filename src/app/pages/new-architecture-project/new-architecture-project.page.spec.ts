import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewArchitectureProjectPage } from './new-architecture-project.page';

describe('NewArchitectureProjectPage', () => {
  let component: NewArchitectureProjectPage;
  let fixture: ComponentFixture<NewArchitectureProjectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArchitectureProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
