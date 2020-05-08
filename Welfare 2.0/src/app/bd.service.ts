import * as firebase from "firebase";
import { Injectable } from "@angular/core";
import { Progresso } from "./progresso.service";

@Injectable()
export class Bd {
  constructor(private progresso: Progresso) {}

  public publicar(exame: any): void {
    console.log(exame);

    firebase
      .database()
      .ref(`exames/${btoa(exame.email)}`)
      .push({
        tipoExame: exame.tipoExame,
        data: exame.data,
        obs: exame.obs,
      })
      .then((resposta: any) => {
        let nomeImagem = resposta.key;
        firebase
          .storage()
          .ref()
          .child(`Fotos_Exames/${nomeImagem}/perfi.jpg`)
          .put(exame.imagem)
          .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              this.progresso.status = "andamento";
              this.progresso.estado = snapshot;
              //console.log(snapshot)
            },
            (error) => {
              this.progresso.status = "erro";
              //console.log(error)
            },
            () => {
              this.progresso.status = "concluido";
              //console.log('upload completo')
            }
          );
      });
  }

  public atualizarExame(exame: any, email: string, key: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log("atualizar", exame);
      console.log("atualizar", email, key);
      firebase
        .database()
        .ref(`exams/${btoa(email)}/${key}`)

        .set(exame)
        .then((result: any) => {
          if (exame.imagem) {
            //firebase.storage().ref(`imagens/${key}`).delete()
            let nomeImagem = key;
            firebase
              .storage()
              .ref()
              .child(`Fotos_Exames/${nomeImagem}/perfi.jpg`)
              .put(exame.imagem)
              .on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                //acompanhamento do progresso do upload
                (snapshot: any) => {},
                (error) => {
                  reject(error);
                },
                () => {
                  resolve(result);
                }
              );
          } else {
            resolve(result);
          }
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public atualizarUser(usuario: any, email: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log("atualizar", usuario);
      console.log("atualizar", email);
      firebase
        .database()
        .ref(`usuarios/${btoa(email)}`)

        .update(usuario)
        .then((result: any) => {
          if (usuario.imagem) {
            firebase
              .storage()
              .ref()
              .child(`UsuarioImagem/${btoa(email)}`)
              .put(usuario.imagem)
              .on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                //acompanhamento do progresso do upload
                (snapshot: any) => {},
                (error) => {
                  reject(error);
                },
                () => {
                  resolve(result);
                }
              );
          } else {
            resolve(result);
          }
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public consultaPublicacaoPorKey(key: any, email: string): Promise<any> {
    console.log(key, email, "metodo consulta");
    return new Promise<any>((resolve, reject) => {
      firebase
        .database()
        .ref(`exams/${btoa(email)}/${key}`)
        .once("value")
        .then((result: any) => {
          resolve(result.val());
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public consultaUser(email: string): Promise<any> {
    console.log(email);
    return new Promise<any>((resolve, reject) => {
      firebase
        .database()
        .ref(`usuarios/${btoa(email)}`)
        .once("value")
        .then((result: any) => {
          resolve(result.val());
          if (
            firebase.database().ref(`usuarios/${btoa(email)}/imgusu`) == null
          ) {
            console.log("deu certo");
          }
          firebase
            .storage()
            .ref()
            .child(`UsuarioImagem/${btoa(email)}`)
            .getDownloadURL()
            .then((url: string) => {
              let urlImg = url;
              firebase
                .database()
                .ref(`usuarios/${btoa(email)}`)
                .update({ imgusu: urlImg });
            });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public consultaPublicacoes(emailUsuario: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //consultar exames no database
      firebase
        .database()
        .ref(`exams/${btoa(emailUsuario)}`)
        .orderByKey()
        .once("value")
        .then((snapshot: any) => {
          console.log(snapshot.val());

          let publicacoes: Array<any> = [];

          snapshot.forEach((childSnapshot: any) => {
            let publicacao = childSnapshot.val();
            publicacao.key = childSnapshot.key;

            publicacoes.push(publicacao);
          });
          //resolve(publicacoes)
          return publicacoes.reverse();
        })
        .then((publicacoes: any) => {
          publicacoes.forEach((publicacao) => {
            //consultar a url da imagem
            firebase
              .storage()
              .ref()
              .child(`Fotos_Exames/${publicacao.key}/perfi.jpg`)
              .getDownloadURL()
              .then((url: string) => {
                let urlImg = url;
                console.log(urlImg);
                console.log(btoa(emailUsuario));
                firebase
                  .database()
                  .ref(`exams/${btoa(emailUsuario)}/${publicacao.key}`)
                  .update({
                    perfi: urlImg,
                    perfilCompact: urlImg,
                    id: publicacao.key,
                    usuarioId: btoa(emailUsuario),
                  });

                publicacao.url_imagem = url;

                firebase
                  .database()
                  .ref(`usuarios/${btoa(emailUsuario)}`)
                  .once("value")
                  .then((snapshot: any) => {
                    publicacao.nome_usuario = snapshot.val().nome;
                  });
              });
          });

          resolve(publicacoes);
        });
    });
  }

  public excluirPublicacao(emailUsuario: string, key: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`exams/${btoa(emailUsuario)}/${key}`)
        .remove()
        .then((result: any) => {
          firebase
            .storage()
            .ref(`Fotos_Exames/${key}/perfi.jpg`)
            .delete()
            .then((result1: any) => {
              resolve(result1);
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
}
