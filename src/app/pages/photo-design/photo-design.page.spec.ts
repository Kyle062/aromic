import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoDesignPage } from './photo-design.page';

describe('PhotoDesignPage', () => {
  let component: PhotoDesignPage;
  let fixture: ComponentFixture<PhotoDesignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDesignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
