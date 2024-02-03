import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesPetsComponent } from './detalhes-pets.component';

describe('DetalhesPetComponent', () => {
  let component: DetalhesPetsComponent;
  let fixture: ComponentFixture<DetalhesPetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesPetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
