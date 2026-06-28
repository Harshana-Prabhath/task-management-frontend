export interface ITeamMember {
    id: string;
    name: string | null; 
    email: string;
    role: "User" | "Admin";

}