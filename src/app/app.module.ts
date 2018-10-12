import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';



import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule,
    MatButtonModule, MatSnackBarModule, MatListModule, MatList } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { ApiService } from './api.service';
import { TokenInterceptorService } from './token-interceptor.service';

@NgModule({
    declarations: [
        AppComponent,
        RoutingComponents
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        HttpClientModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatDividerModule,
        MatCheckboxModule,
        MatListModule,
        ToastrModule.forRoot()
    ],
    providers: [ApiService, AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
