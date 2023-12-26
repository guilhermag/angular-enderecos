import { Component, OnInit, inject } from '@angular/core';
import { CepCodeService } from './shared/services/cep-code.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CepRes, EnderecoInfo } from './shared/model/endereco';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { EnderecoService } from './shared/services/endereco.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-enderecos';
  cepService = inject(CepCodeService);
  enderecoService = inject(EnderecoService);

  estadoSelecionado = 'default';

  estados$ = this.cepService.getEstados();

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
    this.enderecoService.enderecos$.pipe(tap(console.log)).subscribe();
    this.form
      .get('cep')
      .valueChanges.pipe(
        debounceTime(1000),
        filter((value) => value.length === 8),
        distinctUntilChanged(),
        switchMap((value) => this.cepService.getCep(value))
      )
      .subscribe((res) => {
        if (res) {
          this.atualizarListaEnderecos(res);
          this.popularFormulario(res);
        }
      });
  }

  submitForm() {
    if (this.form.valid) {
      this.enderecoService.salvarEndereco({
        ...(this.form.value as EnderecoInfo),
      });
    }
  }

  atualizarListaEnderecos(endereco: EnderecoInfo) {
    this.buscas.push(
      new Date().toLocaleDateString('pt-br', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    this.enderecoInfo.push(endereco);
  }

  selecionarEstado(evento: MatSelectChange) {
    this.estadoSelecionado = evento.value;
    this.form.get('uf').setValue(this.estadoSelecionado);
  }

  popularFormulario(info: EnderecoInfo) {
    this.form.get('logradouro').invalid;
    this.form.get('logradouro').setValue(info.logradouro);
    this.form.get('complemento').setValue(info.complemento);
    this.form.get('bairro').setValue(info.bairro);
    this.form.get('localidade').setValue(info.localidade);
    this.estadoSelecionado = info.uf;
    this.form.get('uf').setValue(this.estadoSelecionado);
  }
}
