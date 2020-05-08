import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Bd } from "../../bd.service";
import * as firebase from "firebase";
import { Progresso } from "../../progresso.service";
import { Observable, Subject } from "rxjs";
import "rxjs/Rx";
import * as $ from "jquery";

@Component({
  selector: "app-incluir-exame",
  templateUrl: "./incluir-exame.component.html",
  styleUrls: ["./incluir-exame.component.css"],
})
export class IncluirExameComponent implements OnInit {
  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<
    any
  >();

  public tipoExame: string;

  public email: string;
  private imagem: any;

  public progressoPublicacao: string = "pendente";
  public porcentagemUpload: number;

  public formulario: FormGroup = new FormGroup({
    tipoExame: new FormControl(null, [Validators.required]),
    data: new FormControl(null, [Validators.required]),
    obs: new FormControl(null, [Validators.required]),
  });

  constructor(private bd: Bd, private progresso: Progresso) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email;
    });
  }

  public publicar(): void {
    if (this.formulario.status !== "INVALID") {
      this.bd.publicar({
        email: this.email,
        tipoExame: this.formulario.value.tipoExame,
        data: this.formulario.value.data,
        obs: this.formulario.value.obs,
        imagem: this.imagem[0]
      });

      let acompanhamentoUpload = Observable.interval(1500);

      let continua = new Subject();
      continua.next(true);

      acompanhamentoUpload.takeUntil(continua).subscribe(() => {
        this.progresso.status;
        this.progresso.estado;
        this.progressoPublicacao = "andamento";

        this.porcentagemUpload = Math.round(
          (this.progresso.estado.bytesTransferred /
            this.progresso.estado.totalBytes) *
            100
        );

        if (this.progresso.status === "concluido") {
          this.progressoPublicacao = "concluido";
          //emitir um evento de component parent (home)
          this.atualizarTimeLine.emit();
          continua.next(false);
        }
      });
    } else {
      alert("Preencha todos os campos!");
      this.formulario.get("tipoExame").markAsTouched();
      this.formulario.get("data").markAsTouched();
      this.formulario.get("obs").markAsTouched();
      this.formulario.get("imagem").markAsTouched();
    }
  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files;
  }

  public tipoEx(event: Event): void {
    this.tipoExame = this.formulario.get("tipoExame").value;
  }

  public closeModal(): void {
    setTimeout(() => {
      this.progressoPublicacao = "pendente";
    }, 500);
    this.formulario.reset();
    //$('#exampleModal')[0].modal('hide')
  }
}
