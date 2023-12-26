import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CepRes, EnderecoInfo, Estado } from '../model/endereco';
import { IBGE_UF_URL, VIACEP_URL } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  http = inject(HttpClient);

  readonly viaCepURL = VIACEP_URL;
  readonly ibgeURL = IBGE_UF_URL;

  getCep(cep: string): Observable<EnderecoInfo> {
    return this.http
      .get<CepRes>(`${this.viaCepURL}${cep}/json/`)
      .pipe(map((res) => this.mapResposta(res)));
  }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.ibgeURL).pipe(
      map((res) => {
        const estadosOrdenados = res.sort((a, b) => (a.nome < b.nome ? -1 : 1));
        return estadosOrdenados.map((estado) => ({
          sigla: estado.sigla,
          nome: estado.nome,
        }));
      })
    );
  }

  private mapResposta(res: CepRes): EnderecoInfo {
    if ('erro' in res) {
      return null;
    }
    return {
      cep: res.cep,
      logradouro: res.logradouro,
      bairro: res.bairro,
      numero: '',
      complemento: res.complemento,
      localidade: res.localidade,
      uf: res.uf,
    };
  }
}
