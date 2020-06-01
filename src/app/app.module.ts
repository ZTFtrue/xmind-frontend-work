import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TextPipe } from './text.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ListItemViewComponent } from './list-item-view/list-item-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TextPipe,
    ListItemViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
