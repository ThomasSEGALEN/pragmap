export interface IRoadmap {
	id: string
	name: string
	data: string
	customerId: string
	customerName: string
	createdAt: string
	updatedAt: string
}
export interface IGetRoadmap {
	id: string
	name: string
	data: string
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
	name?: string
	data?: string
}
