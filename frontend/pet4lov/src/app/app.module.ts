import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';

registerLocaleData(ptBr);
@NgModule({
  declarations: [
  //   NaoEncontradaComponent,
  //   LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // HttpClientModule,
    // FormsModule,
    // ReactiveFormsModule,
    // ContatoModule,
  ],
  providers: [
    AuthInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
  bootstrap: []
})
export class AppModule { }
