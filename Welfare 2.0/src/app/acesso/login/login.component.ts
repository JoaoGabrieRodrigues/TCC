import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'

import { Autenticacao } from '../../autenticacao.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'senha': new FormControl(null, [Validators.required])
  })

  constructor(
    private autenticacao: Autenticacao,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public exibirPainelCadastro(): void {
    this.exibirPainel.emit('cadastro')
  }

  public autenticar(): void {
    if (this.formulario.status !== 'INVALID') {
      this.autenticacao.autenticar(
        this.formulario.value.email,
        this.formulario.value.senha
      )
        .then(() => {
          this.router.navigate(['/home'])
        })
        .catch((error: Error) => {
          alert('Usuário ou senha inválido(s).')
        })
    } else {
      this.formulario.get('email').markAsTouched()
      this.formulario.get('senha').markAsTouched()
    }
  }

  public autenticarComGoogle(): void {
    this.autenticacao.autenticarComGoogle()
      .then(() => {
        this.router.navigate(['/home'])

      })
  }

}
