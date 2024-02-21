import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPetsComponent } from './formulario-pets.component';

describe('FormularioPetsComponent', () => {
  let component: FormularioPetsComponent;
  let fixture: ComponentFixture<FormularioPetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
