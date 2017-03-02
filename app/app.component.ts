import { Component, OnInit} from '@angular/core';

import { WebStorageService, IWebStorageServicePayload } from '../lib';

import * as moment from 'moment';

const user: string = 'tempUser';
const testKey: string = 'testKey';

@Component({
	selector: 'scc-app',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
	currentWebStorageValue;

	constructor(private webstoageService: WebStorageService) {
	}

	ngOnInit() {
		this.currentWebStorageValue = this.webstoageService.get(testKey, user);
	}

	setStorage(value: string): void {
		console.log(value);
		let payload: IWebStorageServicePayload = { key: testKey, user: user, value: value, timestamp: moment() };
		this.webstoageService.set(payload);

		this.currentWebStorageValue = this.webstoageService.get(testKey, user);
	}


}
