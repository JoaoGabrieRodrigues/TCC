import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Bd } from '../../bd.service';
import * as firebase from 'firebase'

@Component({
  selector: 'app-exames',
  templateUrl: './exames.component.html',
  styleUrls: ['./exames.component.css']
})
export class ExamesComponent implements OnInit {

  public tipoExame: string

  public email: string
  public publicacoes: any
  public keyExame: string

  public formularioEditar: FormGroup = new FormGroup({
    'tipoExame': new FormControl(null, [Validators.required]),
    'data': new FormControl(null, [Validators.required]),
    'obs': new FormControl(null, [Validators.required]),
    'imagem': new FormControl(null)
  })

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email

      this.atualizarTimeLine()
    })
  }

  public atualizarTimeLine(): void {
    this.bd.consultaPublicacoes(this.email)
      .then((publicacoes: any) => {
        this.publicacoes = publicacoes
        //console.log(this.publicacoes)
      })
  }

  public exameKeyExcluir(key: any) {
    this.keyExame = key;
  }

  public excluirPublicacao(key: any): void {
    console.log('chegamos na classe exame', key)
    this.bd.excluirPublicacao(this.email, key)
      .then((result: any) => {
        console.log('sucesso ', result)
        alert('Exame excluído com sucesso!')
        this.atualizarTimeLine();
      })
      .catch((error: Error) => {
        console.log(error)
        alert('Parece que algo deu errado. Tente novamente!')
      })

  }

  public tipoEx(event: Event): void {
    this.tipoExame = this.formularioEditar.get('tipoExame').value
  }

  public editarPublicacao(key: any): void {
    console.log('classe editar ', key, this.email)
    this.keyExame = key
    this.bd.consultaPublicacaoPorKey(key, this.email)
      .then((result: any) => {
        console.log('sucesso ', result)
        this.formularioEditar.patchValue(result)
      })
      .catch((error: Error) => {
        console.log(error)
      })
  }

  public atualizar(key: any): void {
    if (this.formularioEditar.status != 'INVALID') {
      this.bd.atualizarExame(this.formularioEditar.getRawValue(), this.email, key)
        .then((result: any) => {
          console.log('sucesso ', result)
          alert('Exame atualizado com sucesso!')
          this.atualizarTimeLine();
        })
        .catch((error: Error) => {
          console.log(error)
          alert('Parece que algo deu errado. Tente novamente!')
        })
    } else {
      alert('Preencha todos os campos!')
      this.formularioEditar.get('tipoExame').markAsTouched()
      this.formularioEditar.get('data').markAsTouched()
      this.formularioEditar.get('obs').markAsTouched()
    }
  }

  public preparaImagemUpload(event: Event): void {
    this.formularioEditar.controls.imagem.setValue((<HTMLInputElement>event.target).files[0])
  }

}
