import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { EnderecoFormComponent } from './views/endereco-form/endereco-form.component';
import { TabelaPesquisasComponent } from './views/tabela-pesquisas/tabela-pesquisas.component';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [AppComponent, EnderecoFormComponent, TabelaPesquisasComponent, ModalComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
