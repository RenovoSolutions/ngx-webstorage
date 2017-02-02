import { Moment } from 'moment';

export interface IWebStorageServicePayload {
	key: string;
	user?: string;
	value: any;
	timestamp: Moment;
}