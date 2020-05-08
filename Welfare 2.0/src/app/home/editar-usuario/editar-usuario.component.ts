import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { Bd } from "../../bd.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Autenticacao } from "../../autenticacao.service";

@Component({
  selector: "app-editar-usuario",
  templateUrl: "./editar-usuario.component.html",
  styleUrls: ["./editar-usuario.component.css"],
})
@Injectable()
export class EditarUsuarioComponent implements OnInit {
  public email: string;
  public fotoUser: string;

  public formularioUser: FormGroup = new FormGroup({
    nome: new FormControl(null),
    endereco: new FormControl(null),
    idade: new FormControl(null),
    sexo: new FormControl(null),
    telefone: new FormControl(null),
    imagem: new FormControl(null),
  });

  constructor(
    private bd: Bd,
    private router: Router,
    private autenticacao: Autenticacao
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email;
      this.bd
        .consultaUser(this.email)
        .then((result: any) => {
          console.log("sucesso ", result);
          this.formularioUser.patchValue(result);
          this.pegarDadosUser();
        })
        .catch((error: Error) => {
          console.log(error);
        });
    });
  }

  public atualizar(): void {
    this.bd
      .atualizarUser(this.formularioUser.getRawValue(), this.email)
      .then((result: any) => {
        console.log("sucesso ", result);
        alert("Perfil atualizado com sucesso!");
        this.router.navigate(["/home"]);
      })
      .catch((error: Error) => {
        console.log(error);
        alert("Parece que algo deu errado :(. Tente novamente!");
      });
  }

  public preparaImagemUpload(event: Event): void {
    this.formularioUser.controls.imagem.setValue(
      (<HTMLInputElement>event.target).files[0]
    );
  }

  private pegarDadosUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      firebase
        .database()
        .ref(`usuarios/${btoa(this.email)}`)
        .once("value")
        .then((result: any) => {
          resolve(result.val());
          let user = result.val();
          console.log("aqui temos os valores de user ", user);
          this.fotoUser = user.imgusu;
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public sair(): void {
    this.autenticacao.sair();
  }
}
