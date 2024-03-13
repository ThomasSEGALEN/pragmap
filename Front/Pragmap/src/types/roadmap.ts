export interface IRoadmap {
	id: string
	name: string
	data: Array<Record<any, any>> | null
	customerId: string
	customerName: string
	createdAt: string
	updatedAt: string
}
export interface IGetRoadmap {
	id: string
	name: string
	data: Array<Record<any, any>> | null
	customerId: string
	createdAt: string
	updatedAt: string
}
export interface IPostRoadmap {
	name: string
	customerId: string
}

export interface IPutRoadmap {
	id: string
	name: string
	data?: Array<Record<any, any>> | null
}
