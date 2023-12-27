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
    expect(component.cepMensagem).toEqual('Procurando CEP');
    tick(2000);

    expect(component.cepMensagem).toEqual('');
    expect(component.form.get('logradouro').value).toEqual(cepMock.logradouro);
    expect(component.form.get('bairro').value).toEqual(cepMock.bairro);
    expect(component.form.get('localidade').value).toEqual(cepMock.localidade);
    expect(component.form.get('uf').value).toEqual(cepMock.uf);
  }));

  it('deve popular o formulario com valores em branco, caso o cep não exista', fakeAsync(() => {
    cepServiceMock.getCep.and.returnValue(of(null));
    component.form.get('cep').setValue('86709240');
    fixture.detectChanges();
    tick(2000);
    expect(component.cepMensagem).toEqual('CEP não encontrado');
    tick(1000);

    expect(component.cepMensagem).toEqual('');
    expect(component.form.get('logradouro').value).toEqual('');
    expect(component.form.get('bairro').value).toEqual('');
    expect(component.form.get('localidade').value).toEqual('');
    expect(component.form.get('uf').value).toEqual('');
  }));

  it('não deve popular o formulario, caso o cep seja nulo', fakeAsync(() => {
    cepServiceMock.getCep.and.returnValue(of(null));
    component.form.get('cep').setValue(null);
    fixture.detectChanges();
    tick(1000);
    expect(component.cepMensagem).toEqual('');
    tick(2000);

    expect(component.form.get('logradouro').value).toEqual('');
    expect(component.form.get('bairro').value).toEqual('');
    expect(component.form.get('localidade').value).toEqual('');
    expect(component.form.get('uf').value).toEqual('');
  }));

  describe('enviar formulario', () => {
    beforeEach(() => {
      const info = deepClone(enderecoMock);
      component.enderecoEditado = info;
      component.form.get('cep').setValue(info.cep);
      component.form.get('logradouro').setValue(info.logradouro);
      component.form.get('numero').setValue(info.numero);
      component.form.get('complemento').setValue(info.complemento);
      component.form.get('bairro').setValue(info.bairro);
      component.form.get('localidade').setValue(info.localidade);
      component.form.get('uf').setValue(info.uf);
      enderecoServiceMock.salvarEndereco.calls.reset();
      enderecoServiceMock.editarEndereco.calls.reset();
    });

    it('salvar formulario, caso seja válido', () => {
      const info = deepClone(enderecoMock);
      delete info.id;
      delete info.horarioPesquisa;
      component.submeterForm();
      expect(enderecoServiceMock.salvarEndereco).toHaveBeenCalledWith(info);
    });

    it('editar formulario, caso seja válido', () => {
      const info = deepClone(enderecoMock);
      info.horarioPesquisa = '';
      component.enderecoEditado = info;
      component.modo = 'edicao';
      component.submeterForm();
      expect(enderecoServiceMock.editarEndereco).toHaveBeenCalledWith(info);
    });
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

  it('deve limpar o limpar o formulário', () => {
    component.limparFormulario();
    expect(component.modo).toEqual('criacao');
    expect(component.botaoSubmeter).toEqual('cadastrar');
  });

  it('deve atualizar a lista de enderecos', () => {
    const info = deepClone(enderecoMock);
    component['atualizarListaEnderecos'](info);
    expect(enderecoServiceMock.salvarEndereco).toHaveBeenCalledWith(
      info,
      'enderecosPesquisados'
    );
  });

  it('deve popular o formulario', () => {
    const info = deepClone(enderecoMock);
    component['popularFormulario'](info);
    expect(component.form.get('cep').value).toEqual(info.cep);
    expect(component.form.get('logradouro').value).toEqual(info.logradouro);
    expect(component.form.get('bairro').value).toEqual(info.bairro);
    expect(component.form.get('localidade').value).toEqual(info.localidade);
    expect(component.form.get('uf').value).toEqual(info.uf);
  });
});
