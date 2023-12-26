import { Injectable } from '@angular/core';
import { EnderecoInfo } from '../model/endereco';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  enderecos$ = new BehaviorSubject<EnderecoInfo[]>(this.getEnderecos());

  getEnderecos(): EnderecoInfo[] {
    const enderecos = localStorage.getItem('enderecos');
    return enderecos ? JSON.parse(enderecos) : [];
  }

  salvarEndereco(endereco: EnderecoInfo) {
    const enderecos = this.getEnderecos();
    endereco.id = enderecos.length + 1;
    const enderecosAtualizados = [...enderecos, endereco];
    this.enderecos$.next(enderecosAtualizados);
    const enderecosString = JSON.stringify(enderecosAtualizados);
    localStorage.setItem('enderecos', enderecosString);
  }
}
