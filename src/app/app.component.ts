import { Component, inject } from '@angular/core';
import { EnderecoService } from './shared/services/endereco.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-enderecos';
  enderecoService = inject(EnderecoService);
  enderecosPesquisados$ = this.enderecoService.enderecosPesquisados$;
}
