import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { EnderecoInfo } from 'src/app/shared/model/endereco';
import { EnderecoService } from 'src/app/shared/services/endereco.service';

@Component({
  selector: 'tabela-pesquisas',
  templateUrl: './tabela-pesquisas.component.html',
  styleUrls: ['./tabela-pesquisas.component.scss'],
})
export class TabelaPesquisasComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  enderecoService = inject(EnderecoService);
  @Input() enderecos$ = of([]);
  @Input() editavel = false;
  @Output() editarEndereco = new EventEmitter<EnderecoInfo>();

  colunas: string[] = [
    'id',
    'cep',
    'logradouro',
    'bairro',
    'localidade',
    'uf',
    'horarioPesquisa',
    'acao',
  ];

  colunasTabela: string[] = this.colunas.slice(0, -1);

  dadosEnderecos: EnderecoInfo[] = [];

  ngOnInit(): void {
    this.enderecos$.subscribe((res) => (this.dadosEnderecos = res));
    if (this.editavel) {
      this.colunasTabela.push('acao');
    }
  }

  editar(endereco: EnderecoInfo) {
    this.editarEndereco.emit(endereco);
  }

  excluir(endereco: EnderecoInfo) {
    const dialogRef = this.dialog.open(ModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.enderecoService.excluirEndereco(endereco);
      }
    });
  }
}
