import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { EnderecoFormComponent } from './endereco-form.component';
import { AppModule } from 'src/app/app.module';
import { CepService } from 'src/app/shared/services/cep.service';
import { cepMock, enderecoMock, estadosMock } from 'src/app/shared/mocks/cep';
import { of } from 'rxjs';
import { deepClone } from 'src/app/shared/utils/utils';
import { EnderecoService } from 'src/app/shared/services/endereco.service';
import { EnderecoInfo } from 'src/app/shared/model/endereco';
import { MatSelectChange } from '@angular/material/select';

describe('EnderecoFormComponent', () => {
  let component: EnderecoFormComponent;
  let fixture: ComponentFixture<EnderecoFormComponent>;
  let cepServiceMock: jasmine.SpyObj<CepService> = jasmine.createSpyObj({
    getEstados: of(estadosMock),
    getCep: of(cepMock),
  });

  let enderecoServiceMock: jasmine.SpyObj<EnderecoService> =
    jasmine.createSpyObj(
      {
        salvarEndereco: null,
        editarEndereco: null,
      },
      {
        enderecos$: of([]),
      }
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnderecoFormComponent],
      imports: [AppModule],
      providers: [
        { provide: CepService, useValue: cepServiceMock },
        { provide: EnderecoService, useValue: enderecoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnderecoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve popular o formulario com base no cep digitado, caso o cep exista', fakeAsync(() => {
    cepServiceMock.getCep.and.returnValue(of(cepMock));
    component.form.get('cep').setValue('86709240');
    fixture.detectChanges();
    tick(1000);
    expect(component.cepMensagem).toBe('Procurando CEP');
    tick(2000);

    expect(component.cepMensagem).toBe('');
    expect(component.form.get('logradouro').value).toBe(cepMock.logradouro);
    expect(component.form.get('bairro').value).toBe(cepMock.bairro);
    expect(component.form.get('localidade').value).toBe(cepMock.localidade);
    expect(component.form.get('uf').value).toBe(cepMock.uf);
  }));

  it('deve popular o formulario com base no cep digitado, caso o cep não exista', fakeAsync(() => {
    cepServiceMock.getCep.and.returnValue(of(null));
    component.form.get('cep').setValue('86709240');
    fixture.detectChanges();
    tick(2000);
    expect(component.cepMensagem).toBe('CEP não encontrado');
    tick(1000);

    expect(component.cepMensagem).toBe('');
    expect(component.form.get('logradouro').value).toBe('');
    expect(component.form.get('bairro').value).toBe('');
    expect(component.form.get('localidade').value).toBe('');
    expect(component.form.get('uf').value).toBe('');
  }));

  it('deve enviar o formulario, caso seja válido', () => {
    const info = deepClone(enderecoMock);
    delete info.id;
    component.form.get('cep').setValue(info.cep);
    component.form.get('logradouro').setValue(info.logradouro);
    component.form.get('numero').setValue(info.numero);
    component.form.get('complemento').setValue(info.complemento);
    component.form.get('bairro').setValue(info.bairro);
    component.form.get('localidade').setValue(info.localidade);
    component.form.get('uf').setValue(info.uf);
    component.submeterForm();
    expect(enderecoServiceMock.salvarEndereco).toHaveBeenCalledWith(info);
    component.modo = 'edicao';
    component.submeterForm();
    expect(enderecoServiceMock.salvarEndereco).toHaveBeenCalledWith(info);
  });

  it('deve enviar o formulario, caso seja válido no modo edicao', () => {
    const info = deepClone(enderecoMock);
    info.horarioPesquisa = '';
    component.enderecoEditado = info;
    component.modo = 'edicao';

    component.form.get('cep').setValue(info.cep);
    component.form.get('logradouro').setValue(info.logradouro);
    component.form.get('numero').setValue(info.numero);
    component.form.get('complemento').setValue(info.complemento);
    component.form.get('bairro').setValue(info.bairro);
    component.form.get('localidade').setValue(info.localidade);
    component.form.get('uf').setValue(info.uf);
    component.submeterForm();
    expect(enderecoServiceMock.editarEndereco).toHaveBeenCalledWith(info);
  });

  it('deve mudar as propriedades do componente ao clicar em editar endereco', () => {
    const info = deepClone(enderecoMock);
    component.editarEndereco(info);
    expect(component.modo).toEqual('edicao');
    expect(component.botaoSubmeter).toEqual('editar');
    expect(component.enderecoEditado).toEqual(info);
  });

  it('deve selecionar o estado', () => {
    const evento = { value: estadosMock[0].sigla } as MatSelectChange;
    component.selecionarEstado(evento);
    expect(component.estadoSelecionado).toEqual(estadosMock[0].sigla);
  });
});
