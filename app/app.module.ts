import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { WebStorageModule } from '../lib';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		WebStorageModule.withConfig({
			prefix: 'my-app',
			storageType: 'localStorage'
		}),
	],
	bootstrap: [AppComponent],
	declarations: [AppComponent],
})
export class AppModule {}
