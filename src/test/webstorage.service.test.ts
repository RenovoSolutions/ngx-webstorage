
require('zone.js');
import 'reflect-metadata';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

import { WebStorageService, IWebStorageServiceConfig, IWebStorageServicePayload } from '../index';

describe('WebStorageService', () => {
	var webStorageService: WebStorageService = null;

    beforeEach(()=>{
			webStorageService = new WebStorageService({prefix:'unitTestPrfx', storageType:'localStorage'});
    });

    it('should have an instance',()=>{
			expect(webStorageService).not.toBeNull;
	});
});