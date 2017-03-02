import {
	WebStorageService,
	IWebStorageServiceConfig,
	IWebStorageServicePayload,
	DEPRECATED,
	WEB_STORAGE_NOT_SUPPORTED
} from './index';

import * as moment from 'moment';

describe('WebStorageService', () => {
	let webStorageService: WebStorageService = null;
	const defaultConfig: IWebStorageServiceConfig = { prefix: '', storageType: 'localStorage' };

	beforeEach(() => {
		webStorageService = new WebStorageService(defaultConfig);
	});

	describe('initialization', () => {

		it('should have an instance', () => {
			expect(webStorageService);
		});

		it('should set the prefix to ls when nothing is passed in the settings', () => {
			expect(webStorageService.prefix).to.equal('ls');
		})

		it('should set the prefix to what is passed in the settings', () => {
			let expectedPrefix = 'expectedPrfx';

			let fakeConfig = { prefix: expectedPrefix, storageType: defaultConfig.storageType};

			webStorageService = new WebStorageService(fakeConfig);

			expect(webStorageService.prefix).to.equal(expectedPrefix);
		})

		it('should set the storage type according to the settings', () => {
			expect(webStorageService.storageType).to.equal(defaultConfig.storageType);
		})

		it('should check to see if web storage is supported', () => {
			const isSupported: boolean = true;
			let mockCheckSupport = sinon.spy(() => isSupported);

			webStorageService.checkSupport = mockCheckSupport

			webStorageService.reInit();

			sinon.assert.calledOnce(mockCheckSupport);
			expect(isSupported).to.be.equal(isSupported);

		})
	});

	describe('derive key', () => {
		it('should handle empty user strings', () => {
			const key: string = "ThisIsAKey";
			const expectedKey = `ls.${key}`;

			expect(webStorageService.deriveKey(key)).to.be.equal(expectedKey);
		});

		it('should handle user strings', () => {
			const key: string = "ThisIsAKey";
			const user: string = "UserName";
			const expectedKey = `ls.${user}.${key}`;

			expect(webStorageService.deriveKey(key, user)).to.be.equal(expectedKey);
		});
	});

	describe('get', () => {
		let mockBrowserStorage: Storage;
		let fakeItem = { Id: 123 };
		let warnSpy: sinon.SinonSpy;
		let getItemSpy: sinon.SinonSpy;

		beforeEach(() => {
			warnSpy = sinon.spy(() => console.warn);
			console = <any>{
				log: console.log,
				error: console.error,
				warn: warnSpy
			};

			getItemSpy = sinon.spy(() => JSON.stringify(fakeItem));
			mockBrowserStorage = <any>{ getItem: <any>getItemSpy};
			webStorageService = new WebStorageService({ ...defaultConfig, mockWebStorage: mockBrowserStorage });

			const isSupported: boolean = true;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport
		});

		it('should check if web storage is supported by the browser', () => {

			webStorageService.get('dontCare');

			sinon.assert.notCalled(warnSpy);
		});

		it('should display console log when web storage is not supported', () => {
			const isSupported: boolean = false;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport

			webStorageService.reInit();

			webStorageService.get('dontCare');

			sinon.assert.calledOnce(warnSpy);
			sinon.assert.calledWith(warnSpy, 'webStorageError', WEB_STORAGE_NOT_SUPPORTED);
		});

		it('should make call to getItem to retreive data from web storage', () => {
			webStorageService.get('dontCare');

			sinon.assert.calledOnce(getItemSpy);
		});

		it('should parse json string to real object', () => {
			webStorageService.reInit();

			let result = webStorageService.get('dontCare');

			expect(result).to.deep.equal(fakeItem);
		});
	});

	describe('set', () => {
		let mockBrowserStorage: Storage;
		let fakeItem = { Id: 123 };
		let warnSpy: sinon.SinonSpy;
		let setItemSpy: sinon.SinonSpy;

		beforeEach(() => {
			warnSpy = sinon.spy(() => console.warn);
			console = <any>{
				log: console.log,
				error: console.error,
				warn: warnSpy
			};

			setItemSpy = sinon.spy();
			mockBrowserStorage = <any>{ setItem: <any>setItemSpy };
			webStorageService = new WebStorageService({ ...defaultConfig, mockWebStorage: mockBrowserStorage });

			const isSupported: boolean = true;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport
		});

		it('should throw warning when webstorage not supported', () => {
			const isSupported: boolean = false;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport

			webStorageService.reInit();

			let payload: IWebStorageServicePayload = { key: 'key', user: 'user', value: {}, timestamp: moment() };

			webStorageService.set(payload);

			sinon.assert.calledOnce(warnSpy);
			sinon.assert.calledWith(warnSpy, 'webStorageError', WEB_STORAGE_NOT_SUPPORTED);
		});

		it('should call setItem from ', () => {
			let payload: IWebStorageServicePayload = { key: 'key', user: 'user', value: {}, timestamp: moment() };

			webStorageService.set(payload);

			sinon.assert.calledOnce(setItemSpy);
		});

		it('should serialize the payload', () => {
			const fakeData = { id: 234, thing: 'thing' };

			let payload: IWebStorageServicePayload = { key: 'key', user: 'user', value: fakeData, timestamp: moment() };

			webStorageService.set(payload);

			sinon.assert.calledWith(setItemSpy, webStorageService.deriveKey(payload.key, payload.user), JSON.stringify(payload));
		});
	});

	describe('remove', () => {
		let mockBrowserStorage: Storage;
		let fakeItem = { Id: 123 };
		let warnSpy: sinon.SinonSpy;
		let removeItemSpy: sinon.SinonSpy;

		beforeEach(() => {
			warnSpy = sinon.spy(() => console.warn);
			console = <any>{
				log: console.log,
				error: console.error,
				warn: warnSpy
			};

			removeItemSpy = sinon.spy();
			mockBrowserStorage = <any>{ removeItem: <any>removeItemSpy, mockBrowserStorage: mockBrowserStorage };
			webStorageService = new WebStorageService({ ...defaultConfig, mockWebStorage: mockBrowserStorage });

			const isSupported: boolean = true;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport
		});

		it('throw warning if not supported', () => {
			const isSupported: boolean = false;
			let mockCheckSupport = sinon.spy(() => isSupported);
			webStorageService.checkSupport = mockCheckSupport

			webStorageService.reInit();

			webStorageService.remove('user', 'key');

			sinon.assert.calledOnce(warnSpy);
			sinon.assert.calledWith(warnSpy, 'webStorageError', WEB_STORAGE_NOT_SUPPORTED);
		});

		it('should call remove ite for each key passed', () => {

			let keys: string[] = ['key1', 'key2', 'key3'];
			let user: string = 'user';

			webStorageService.remove(user, ...keys);

			sinon.assert.calledThrice(removeItemSpy);
			sinon.assert.calledWith(removeItemSpy, webStorageService.deriveKey(keys[0], user));
			sinon.assert.calledWith(removeItemSpy, webStorageService.deriveKey(keys[1], user));
			sinon.assert.calledWith(removeItemSpy, webStorageService.deriveKey(keys[2], user));
		});
	});
});