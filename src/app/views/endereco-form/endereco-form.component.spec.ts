import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoFormComponent } from './endereco-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';

describe('EnderecoFormComponent', () => {
  let component: EnderecoFormComponent;
  let fixture: ComponentFixture<EnderecoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnderecoFormComponent],
      imports: [AppModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EnderecoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
