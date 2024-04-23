/**
 * Utiliser pour gérer la position des utilisateurs dans une roadmap
 */
export interface UserPostion {
    userId: string;
    username: string;
    xPosition: number;
    yPosition: number;
    scale: number;
}