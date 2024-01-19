import type { IUser } from "@/types";

export interface IRole {
	id: string
	name: string
	users: Array<IUser>;
}

export enum Role {
	Administrator = "Administrateur",
	Manager = "Gestionnaire",
	Editor = "Éditeur",
	Reader = "Lecteur"
}
