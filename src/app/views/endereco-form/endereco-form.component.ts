import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';

import { MatSelectChange } from '@angular/material/select';
import { CepService } from 'src/app/shared/services/cep.service';
import { EnderecoService } from 'src/app/shared/services/endereco.service';
import { EnderecoInfo } from 'src/app/shared/model/endereco';

@Component({
  selector: 'endereco-form',
  templateUrl: './endereco-form.component.html',
  styleUrls: ['./endereco-form.component.scss'],
})
export class EnderecoFormComponent implements OnInit {
  cepService = inject(CepService);
  enderecoService = inject(EnderecoService);
  @ViewChild('formComp') formComponente: NgForm;

  cepMensagem = '';

  estadoSelecionado = 'default';

  estados$ = this.cepService.getEstados();
  enderecosCadastrados$ = this.enderecoService.enderecos$;
  modo = 'criacao';
  botaoSubmeter = 'cadastrar';

  enderecoEditado: EnderecoInfo;

  form = new FormGroup({
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    logradouro: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
    localidade: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
  });

  enderecoInfo: EnderecoInfo[] = [];
  buscas: string[] = [];

  ngOnInit(): void {
    this.form
      .get('cep')
      .valueChanges.pipe(
        debounceTime(1000),
        filter((value) => (value ? value.length === 8 : false)),
        tap(() => {
          this.cepMensagem = 'Procurando CEP';
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        switchMap((value) => this.cepService.getCep(value))
      )
      .subscribe((res) => {
        if (res) {
          this.atualizarListaEnderecos(res);
          this.popularFormulario(res);
          this.cepMensagem = '';
        } else {
          this.cepMensagem = 'CEP não encontrado';
          setTimeout(() => {
            this.cepMensagem = '';
          }, 1000);
        }
      });
  }

  submeterForm() {
    if (this.form.valid) {
      if (this.modo === 'criacao') {
        this.enderecoService.salvarEndereco({
          ...(this.form.value as EnderecoInfo),
        });
      } else {
        const editado = {
          ...(this.form.value as EnderecoInfo),
        };
        editado.id = this.enderecoEditado.id;
        editado.horarioPesquisa = this.enderecoEditado.horarioPesquisa;
        this.enderecoService.editarEndereco(editado);
      }
      this.limparFormulario();
    }
  }

  editarEndereco(endereco: EnderecoInfo) {
    this.modo = 'edicao';
    this.botaoSubmeter = 'editar';
    this.popularFormulario(endereco);
    this.enderecoEditado = endereco;
    this.form.get('complemento').setValue(this.enderecoEditado.complemento);
    this.form.get('numero').setValue(this.enderecoEditado.numero);
  }

  selecionarEstado(evento: MatSelectChange) {
    this.estadoSelecionado = evento.value;
    this.form.get('uf').setValue(this.estadoSelecionado);
  }

  limparFormulario() {
    this.form.reset();
    this.formComponente.resetForm();
    this.modo = 'criacao';
    this.botaoSubmeter = 'cadastrar';
  }

  private atualizarListaEnderecos(endereco: EnderecoInfo) {
    this.enderecoService.salvarEndereco(endereco, 'enderecosPesquisados');
  }

  private popularFormulario(info: EnderecoInfo) {
    this.form.get('cep').setValue(info.cep);
    this.form.get('logradouro').setValue(info.logradouro);
    this.form.get('bairro').setValue(info.bairro);
    this.form.get('localidade').setValue(info.localidade);
    this.estadoSelecionado = info.uf;
    this.form.get('uf').setValue(this.estadoSelecionado);
  }
}
