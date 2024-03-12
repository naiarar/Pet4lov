import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOngsComponent } from './new-ong.component';

describe('NewOngsComponent', () => {
  let component: NewOngsComponent;
  let fixture: ComponentFixture<NewOngsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOngsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOngsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
