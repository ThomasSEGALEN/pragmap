export interface IRole {
  id: string
  name: string
}

export enum Role {
  Administrator = 'Administrateur',
  Manager = 'Gestionnaire',
  Editor = 'Éditeur',
  Reader = 'Lecteur'
}
