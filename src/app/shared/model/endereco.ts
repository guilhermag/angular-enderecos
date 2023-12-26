export interface EnderecoInfo {
  id?: number;
  horarioPesquisa?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface CepRes extends EnderecoInfo {
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface Estado {
  sigla: string;
  nome: string;
}
