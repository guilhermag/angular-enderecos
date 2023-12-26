import { CepRes, EnderecoInfo } from '../model/endereco';

export const cepResMock: CepRes = {
  cep: '86709-240',
  logradouro: 'Rua Mutumporanga',
  complemento: '',
  bairro: 'Conjunto Centauro',
  localidade: 'Arapongas',
  uf: 'PR',
  ibge: '4101507',
  gia: '',
  ddd: '43',
  siafi: '7427',
};

export const cepMock = {
  cep: '86709-240',
  logradouro: 'Rua Mutumporanga',
  bairro: 'Conjunto Centauro',
  numero: '',
  complemento: '',
  localidade: 'Arapongas',
  uf: 'PR',
};

export const enderecoMock: EnderecoInfo = {
  id: 1,
  cep: '86709-240',
  logradouro: 'Rua Mutumporanga',
  bairro: 'Conjunto Centauro',
  numero: '',
  complemento: '',
  localidade: 'Arapongas',
  uf: 'PR',
};

export const estadosResMock = [
  {
    id: 11,
    sigla: 'RO',
    nome: 'Rondônia',
    regiao: {
      id: 1,
      sigla: 'N',
      nome: 'Norte',
    },
  },
  {
    id: 12,
    sigla: 'AC',
    nome: 'Acre',
    regiao: {
      id: 1,
      sigla: 'N',
      nome: 'Norte',
    },
  },
  {
    id: 14,
    sigla: 'RR',
    nome: 'Roraima',
    regiao: {
      id: 1,
      sigla: 'N',
      nome: 'Norte',
    },
  },
];

export const estadosMock = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
];
