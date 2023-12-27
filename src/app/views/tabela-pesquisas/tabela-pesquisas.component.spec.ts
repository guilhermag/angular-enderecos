import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPesquisasComponent } from './tabela-pesquisas.component';
import { MaterialModule } from 'src/app/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnderecoService } from 'src/app/shared/services/endereco.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EnderecoInfo } from 'src/app/shared/model/endereco';
import { deepClone } from 'src/app/shared/utils/utils';
import { enderecoMock } from 'src/app/shared/mocks/cep';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

describe('TabelaPesquisasComponent', () => {
  let component: TabelaPesquisasComponent;
  let fixture: ComponentFixture<TabelaPesquisasComponent>;
  const info = deepClone(enderecoMock);

  let dialogMock: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj({
    open: { afterClosed: () => of(true) },
  });

  let enderecoServiceMock: jasmine.SpyObj<EnderecoService> =
    jasmine.createSpyObj({
      excluirEndereco: null,
    });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabelaPesquisasComponent],
      imports: [MaterialModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: EnderecoService, useValue: enderecoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaPesquisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir o objeto endereco quando o metodo editarEndereco e chamado', () => {
    spyOn(component.editarEndereco, 'emit');
    component.editar(info);
    expect(component.editarEndereco.emit).toHaveBeenCalledWith(info);
  });

  it('deve chamar o metodo de excluir endereco quando o usuario confirmar a operacao', () => {
    component.excluir(info);
    expect(dialogMock.open).toHaveBeenCalledWith(ModalComponent);
    expect(enderecoServiceMock.excluirEndereco).toHaveBeenCalledWith(info);
  });
});
