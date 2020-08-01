export interface IApiMachine {
	id: string;
	type: 'tvr' | 'tng' | 'tpg';
	address?: string;
	location?: string;
	use?: string;
}

export type IApiMachinesResponse = IApiMachine[];
