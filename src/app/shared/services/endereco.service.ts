import { Injectable } from '@angular/core';
import { EnderecoInfo } from '../model/endereco';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  enderecos$ = new BehaviorSubject<EnderecoInfo[]>(this.getEnderecos());
  enderecosPesquisados$ = new BehaviorSubject<EnderecoInfo[]>(
    this.getEnderecos('enderecosPesquisados')
  );

  getEnderecos(chave = 'enderecos'): EnderecoInfo[] {
    const enderecos = localStorage.getItem(chave);
    return enderecos ? JSON.parse(enderecos) : [];
  }

  salvarEndereco(endereco: EnderecoInfo, chave = 'enderecos') {
    const enderecos = this.getEnderecos(chave);
    endereco.id = enderecos.length + 1;
    endereco.horarioPesquisa = new Date().toLocaleDateString('pt-br', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const enderecosAtualizados = [...enderecos, endereco];
    if (chave === 'enderecos') {
      this.enderecos$.next(enderecosAtualizados);
    } else {
      this.enderecosPesquisados$.next(enderecosAtualizados);
    }
    const enderecosString = JSON.stringify(enderecosAtualizados);
    localStorage.setItem(chave, enderecosString);
  }

  editarEndereco(endereco: EnderecoInfo) {
    const enderecos = this.getEnderecos();
    const indice = enderecos.findIndex((end) => end.id === endereco.id);
    enderecos[indice] = endereco;
    this.atualizarEnderecos(enderecos);
  }

  excluirEndereco(endereco: EnderecoInfo) {
    const enderecos = this.getEnderecos();
    const indice = enderecos.findIndex((end) => end.id === endereco.id);
    enderecos.splice(indice, 1);
    this.atualizarEnderecos(enderecos);
  }

  private atualizarEnderecos(enderecos: EnderecoInfo[]) {
    this.enderecos$.next(enderecos);
    const enderecosString = JSON.stringify(enderecos);
    localStorage.setItem('enderecos', enderecosString);
  }
}
