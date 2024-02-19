export interface IRoadmap {
	id: string
	name: string
	data: string
<<<<<<< Updated upstream
=======
	customerId: string
	createdAt: string
	updatedAt: string
}
export interface IGetRoadMap {
	id: string
	name: string
	data: string
	customerId: string 
	createdAt: string
	updatedAt: string
}
export interface IPostRoadMap {
	name: string
	customerId: string 
}

export interface IPutRoadMap {
	id: string
	name: string
	data?: string
	customerId: string
}
export interface IDisplayRoadMap {
	id: string
	name: string
	data: string
	customerId: string
>>>>>>> Stashed changes
	createdAt: string
	updatedAt: string
}
