export interface IWebStorageServiceConfig {
    // Properties:
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
    mockWebStorage?: Storage;
}
