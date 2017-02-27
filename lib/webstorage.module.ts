import { ModuleWithProviders, NgModule } from '@angular/core';

import { WebStorageService } from './webstorage.service';
import { IWebStorageServiceConfig } from './webstorage.config.interface';

@NgModule({
    providers: [
        WebStorageService
    ]
})
export class WebStorageModule {
    static withConfig(userConfig: IWebStorageServiceConfig = {}): ModuleWithProviders {
        return {
            ngModule: WebStorageModule,
            providers: [
                { provide: 'WEB_STORAGE_SERVICE_CONFIG', useValue: userConfig }
            ]
        }
    }
}
