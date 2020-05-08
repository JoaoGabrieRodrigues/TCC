import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { ROUTES } from './app.routes'

import { Autenticacao } from './autenticacao.service'

import { AppComponent } from './app.component';
import { AcessoComponent } from './acesso/acesso.component';
import { BannerComponent } from './acesso/banner/banner.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { ExamesComponent } from './home/exames/exames.component';
import { AutenticacaoGuard } from './autenticacao-guard.service';
import { IncluirExameComponent } from './home/incluir-exame/incluir-exame.component';
import { Bd } from './bd.service'
import { Progresso } from './progresso.service';

import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from '../environments/environment';
import { EditarUsuarioComponent } from './home/editar-usuario/editar-usuario.component';


@NgModule({
  declarations: [
    AppComponent,
    AcessoComponent,
    BannerComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    ExamesComponent,
    IncluirExameComponent,
    EditarUsuarioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterModule.forRoot(ROUTES),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [Autenticacao, AutenticacaoGuard, Bd, Progresso],
  bootstrap: [AppComponent]
})
export class AppModule { }
