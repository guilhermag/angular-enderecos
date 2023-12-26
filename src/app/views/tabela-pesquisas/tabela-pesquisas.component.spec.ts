import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPesquisasComponent } from './tabela-pesquisas.component';

describe('TabelaPesquisasComponent', () => {
  let component: TabelaPesquisasComponent;
  let fixture: ComponentFixture<TabelaPesquisasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabelaPesquisasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaPesquisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
