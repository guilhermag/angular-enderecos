import { TestBed } from '@angular/core/testing';

import { CepService } from './cep.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  cepMock,
  cepResMock,
  enderecoMock,
  estadosMock,
  estadosResMock,
} from '../mocks/cep';
import { IBGE_UF_URL, VIACEP_URL } from 'src/environments';
import { deepClone } from '../utils/utils';

describe('CepService', () => {
  let servico: CepService;
  let httpTestingController: HttpTestingController;
  let cep = deepClone(cepMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    servico = TestBed.inject(CepService);
  });

  it('deve criar o servico', () => {
    expect(servico).toBeTruthy();
  });

  it('deve retornar os dados do cep', () => {
    const numeroCep = '86709240';
    servico.getCep(numeroCep).subscribe((res) => {
      expect(res).toEqual(cep);
    });
    const request = httpTestingController.expectOne(
      `${VIACEP_URL}${numeroCep}/json/`
    );
    expect(request.request.method).toEqual('GET');
    request.flush(cepResMock);
  });

  it('deve retornar os estados', () => {
    servico.getEstados().subscribe((res) => {
      expect(res).toEqual(estadosMock);
    });
    const request = httpTestingController.expectOne(IBGE_UF_URL);
    expect(request.request.method).toEqual('GET');
    request.flush(estadosResMock);
  });

  it('deve mapear o endereco corretamente', () => {
    expect(servico['mapResposta'](cepResMock)).toEqual(cep);
    expect(servico['mapResposta']({ erro: 'erro' } as any)).toBeNull();
  });
});
