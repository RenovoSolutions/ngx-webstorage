import { Inject, Injectable} from '@angular/core';

import { IWebStorageServiceConfig } from './webstorage.config.interface';
import { IWebStorageServicePayload } from './webstorage.payload.interface';

export const DEPRECATED: string = 'This function is deprecated.';
export const WEB_STORAGE_NOT_SUPPORTED: string = 'WEB_STORAGE_NOT_SUPPORTED';

@Injectable()
export class WebStorageService {
	private _isSupported: boolean = false;
	get isSupported(): boolean {
		return this._isSupported;
	}

	private _prefix: string;
	get prefix(): string {
		return this._prefix;
	}

	private _storageType: 'sessionStorage' | 'localStorage';
	get storageType(): string {
		return this._storageType;
	}

	private webStorage: Storage;

	constructor(
		@Inject('WEB_STORAGE_SERVICE_CONFIG') config: IWebStorageServiceConfig,
	) {
		if (config.mockWebStorage)
		{
			this.webStorage = config.mockWebStorage;
		}

		let { prefix, storageType } = config;
		this._prefix = prefix || 'ls';
		this._storageType = storageType || 'localStorage';

		this._isSupported = this.checkSupport();
	}

	reInit() {
		this._isSupported = this.checkSupport();
	}

	deriveKey(key: string, user?:string): string {
		return user ? `${this.prefix}.${user}.${key}` : `${this.prefix}.${key}`;
	}

	get(key: string, user?: string): IWebStorageServicePayload {

		if (!this.isSupported) {
			console.warn('webStorageError', WEB_STORAGE_NOT_SUPPORTED);
			return null;
		}

		let item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key, user)) : null;

		// FIXME: not a perfect solution, since a valid 'null' string can't be stored
		if (!item || item === 'null') {
			return null;
		}

		try {
			return JSON.parse(item);
		} catch (e) {
			return null;
		}
	}

	getStorageType(): string {
		return this.storageType;
	}

	set(payload:IWebStorageServicePayload): boolean {
		if (payload === undefined) {
			return false;
		}

		let jsonPayload: string = JSON.stringify(payload);

		if (!this.isSupported) {
			console.warn('webStorageError', WEB_STORAGE_NOT_SUPPORTED);
			return false;
		}

		try {
			if (this.webStorage) {
				this.webStorage.setItem(this.deriveKey(payload.key, payload.user), jsonPayload);
			}
		} catch (e) {
			console.error('webStorageError', e.message);
			return false;
		}
		return true;
	}

	remove(user?:string,...keys: Array<string>): boolean {
		let result = true;

		if (!this.isSupported) {
			console.warn('webStorageError', WEB_STORAGE_NOT_SUPPORTED);
			result = false;
		}
		keys.forEach((key: string) => {


			try {
				this.webStorage.removeItem(this.deriveKey(key, user));
			} catch (e) {
				console.log('webStorageError', e.message);
				result = false;
			}
		});
		return result;
	}

	checkSupport(): boolean {
		try {
			let supported = this.storageType in window
				&& window[this.storageType] !== null;

			console.log('supported', supported);

			if (supported) {
				this.webStorage = window[this.storageType];

				// When Safari (OS X or iOS) is in private browsing mode, it
				// appears as though localStorage is available, but trying to
				// call .setItem throws an exception.
				//
				// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
				// to add something to storage that exceeded the quota."
				let key = this.deriveKey(`__${Math.round(Math.random() * 1e7)}`);
				this.webStorage.setItem(key, '');
				this.webStorage.removeItem(key);
			}

			return supported;
		} catch (e) {
			console.log('webStorageError', e.message);
			return false;
		}
	}
}
