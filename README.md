# ngx-webstorage

ngx-webstorage is a service for utilizing both local and session storage resources of a browser. ngx-webstorage was inspired by [angular-2-local-storage](https://github.com/phenomnomnominal/angular-2-local-storage).

## Install:

`npm install ngx-webstorage`

### In your app:

First you need to configure the service:

```typescript
import { WebStorageModule } from 'ngx-webstorage';

@NgModule({
    imports: [
        WebStorageModule.withConfig({
            prefix: 'my-app',
            storageType: 'localStorage'
        })
    ],
    declarations: [
        ..
    ],
    providers: [
        ..
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

If you are using systemjs you will need to add a map to your system.config.js file:
```typescript
    var map = {
	...
	'ngx-webstorage': 'node_modules/ngx-webstorage/index.js',
    ...
};
```

Then you can use it in a component:

```typescript
import { WebStorageService } from 'ngx-webstorage';

@Component({
    // ...
})
export class SomeComponent {
    constructor (
        private webStorageService: WebStorageService
    ) {}
}

```

### Configuration options:

`import { IWebStorageServiceConfig } from 'ngx-webstorage';` for type information about the configuration object.