import { TestBed } from '@angular/core/testing';
import { EnderecoService } from './endereco.service';
import { EnderecoInfo } from '../model/endereco';
import { enderecoMock } from '../mocks/cep';
import { deepClone } from '../utils/utils';

describe('EnderecoService', () => {
  let servico: EnderecoService;
  let storage = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnderecoService],
    });
    servico = TestBed.inject(EnderecoService);
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in storage ? storage[key] : null;
      },
      setItem: (key: string, value: string) => {
        storage[key] = `${value}`;
      },
    };
    storage = {};

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
  });

  it('deve criar o servico', () => {
    expect(servico).toBeTruthy();
  });

  it('deve retornar um array vazio caso não existam enderecos salvos', () => {
    const enderecos = servico.getEnderecos();
    expect(enderecos).toEqual([]);
  });

  it('deve retornar um array de enderecos', () => {
    localStorage.setItem('enderecos', JSON.stringify([enderecoMock]));
    const enderecos = servico.getEnderecos();
    expect(enderecos).toEqual([enderecoMock]);
  });

  it('deve salvar um endereco registrado', () => {
    servico.salvarEndereco(enderecoMock);
    const enderecosSalvos = servico.getEnderecos();
    expect(enderecosSalvos.length).toBe(1);
    expect(enderecosSalvos[0]).toEqual(enderecoMock);
    expect(servico.enderecos$.value).toEqual([enderecoMock]);
  });

  it('deve salvar um endereco pesquisado', () => {
    servico.salvarEndereco(enderecoMock, 'enderecosPesquisados');
    expect(servico.enderecosPesquisados$.value).toEqual([enderecoMock]);
  });

  it('deve editar um endereco', () => {
    spyOn(servico, 'getEnderecos').and.returnValue([enderecoMock]);
    const endereco = deepClone(enderecoMock);
    endereco.localidade = 'Toledo';
    servico.editarEndereco(endereco);
    expect(servico.enderecos$.value).toEqual([endereco]);
  });

  it('deve excluir um endereco', () => {
    servico.salvarEndereco(enderecoMock);
    let enderecos = servico.getEnderecos();
    expect(enderecos.length).toBe(1);
    servico.excluirEndereco(enderecoMock);
    enderecos = servico.getEnderecos();
    expect(enderecos.length).toBe(0);
  });

  it('deve atualizar a lista de enderecos', () => {
    servico['atualizarEnderecos']([enderecoMock]);
    expect(localStorage.getItem('enderecos')).toEqual(
      JSON.stringify([enderecoMock])
    );
  });
});
