import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialsLibraryPage } from './materials-library.page';

describe('MaterialsLibraryPage', () => {
  let component: MaterialsLibraryPage;
  let fixture: ComponentFixture<MaterialsLibraryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsLibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
