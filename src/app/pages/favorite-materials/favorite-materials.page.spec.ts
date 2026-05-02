import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteMaterialsPage } from './favorite-materials.page';

describe('FavoriteMaterialsPage', () => {
  let component: FavoriteMaterialsPage;
  let fixture: ComponentFixture<FavoriteMaterialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
