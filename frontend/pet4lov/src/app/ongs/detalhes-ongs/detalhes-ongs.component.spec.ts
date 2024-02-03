import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesOngsComponent } from './detalhes-ongs.component';

describe('DetalhesOngsComponent', () => {
  let component: DetalhesOngsComponent;
  let fixture: ComponentFixture<DetalhesOngsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesOngsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalhesOngsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
