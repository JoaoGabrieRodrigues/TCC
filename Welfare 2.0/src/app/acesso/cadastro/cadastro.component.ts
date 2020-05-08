import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Usuario } from '../usuario.model'
import { Autenticacao } from '../../autenticacao.service'

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'nome': new FormControl(null, [Validators.required]),
    'senha': new FormControl(null, [Validators.required])
  })

  constructor(
    private autenticacao: Autenticacao
  ) { }

  ngOnInit() {
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  public cadastrarUsuario(): void {
    //console.log(this.formulario)
    if (this.formulario.status !== 'INVALID') {
      let usuario: Usuario = new Usuario(
        this.formulario.value.email,
        this.formulario.value.nome,
        this.formulario.value.endereco,
        this.formulario.value.idade,
        this.formulario.value.sexo,
        this.formulario.value.telefone,
        this.formulario.value.senha,
      )

      this.autenticacao.cadastrarUsuario(usuario)
        .then(() => this.exibirPainelLogin())
    } else{
      this.formulario.get('email').markAsTouched()
      this.formulario.get('nome').markAsTouched()
      this.formulario.get('senha').markAsTouched()
    }
  }

}
