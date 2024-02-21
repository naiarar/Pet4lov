import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioOngsComponent } from './formulario-ongs.component';

describe('FormularioOngsComponent', () => {
  let component: FormularioOngsComponent;
  let fixture: ComponentFixture<FormularioOngsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioOngsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioOngsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
