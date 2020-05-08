import { Router } from "@angular/router";
import { Usuario } from "./acesso/usuario.model";
import * as firebase from "firebase";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable()
export class Autenticacao {
  public token_id: string;
  private user: any;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth
  ) {
    this.angularFireAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  public cadastrarUsuario(usuario: Usuario): Promise<any> {
    console.log("Chegamos até aqui ", usuario);
    /*
        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            */
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.auth
        .createUserWithEmailAndPassword(usuario.email, usuario.senha)
        .then((resposta: any) => {
          delete usuario.senha;
          this.addUser(usuario.email, usuario.nome)
            .then((result: any) => {
              resolve(result);
            })
            .catch((error: Error) => {
              reject(error);
            });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public autenticar(email: string, senha: string): Promise<any> {
    /*firebase.auth().signInWithEmailAndPassword(email,senha)
            .then((resposta:any) => {
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken)
                        this.router.navigate(['/home'])
                    })
            })
            .catch((error: Error) => console.log(error))*/
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, senha);
  }

  public autenticado(): boolean {
    return !!this.user;
  }

  public sair(): Promise<any> {
    return this.angularFireAuth.auth.signOut();
  }

  public autenticarComGoogle(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((user: any) => {
          console.log(user.additionalUserInfo.profile);

          this.addUser(
            user.additionalUserInfo.profile.email,
            user.additionalUserInfo.profile.given_name +
              " " +
              user.additionalUserInfo.profile.family_name
          )
            .then((result: any) => {
              resolve(result);
              this.consultaUser(
                user.additionalUserInfo.profile.picture,
                user.additionalUserInfo.profile.email
              );
            })
            .catch((error: Error) => {
              reject(error);
            });
        });
    });
  }

  private addUser(email, nome): Promise<any> {
    const novoUsuario: any = {
      email: email,
      nome: nome,
    };
    return new Promise<any>((resolve, reject) => {
      firebase
        .database()
        .ref(`usuarios/${btoa(email)}`)
        .update(novoUsuario)
        .then((result) => {
          resolve(result);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  private consultaUser(urlFoto, email): Promise<any> {
    const fotoGoogle: any = {
      email: email,
      imgusu: urlFoto,
    };
    return new Promise<any>((resolve, reject) => {
      firebase
        .database()
        .ref(`usuarios/${btoa(email)}`)
        .once("value")
        .then((result: any) => {
          resolve(result.val());
          console.log(result.val());
          if (result.val().imgusu == null) {
            console.log("eita", urlFoto);
            firebase
              .database()
              .ref(`usuarios/${btoa(email)}`)
              .update({
                imgusu: urlFoto,
              });
          }
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
  /*
    private adicionarFotoGoogle(email, urlFoto): void {
        if (urlFoto != null) {
            console.log('eita preula', urlFoto)
            firebase.database().ref(`usuarios/${btoa(email)}`)
                .update({
                    imgusu: urlFoto
                })
        }
    }*/
}
