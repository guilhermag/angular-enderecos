import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPesquisasComponent } from './tabela-pesquisas.component';
import { MaterialModule } from 'src/app/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TabelaPesquisasComponent', () => {
  let component: TabelaPesquisasComponent;
  let fixture: ComponentFixture<TabelaPesquisasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabelaPesquisasComponent],
      imports: [MaterialModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaPesquisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
