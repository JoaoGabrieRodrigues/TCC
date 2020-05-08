import { Routes } from '@angular/router'
import { AcessoComponent } from './acesso/acesso.component';
import { HomeComponent } from './home/home.component'
import { AutenticacaoGuard } from './autenticacao-guard.service'
import { EditarUsuarioComponent } from './home/editar-usuario/editar-usuario.component';

export const ROUTES: Routes = [
  { path: '', component: AcessoComponent },
  { path: 'home', component: HomeComponent, canActivate: [AutenticacaoGuard] },
  { path: 'usuario', component: EditarUsuarioComponent, canActivate: [AutenticacaoGuard] }
]
