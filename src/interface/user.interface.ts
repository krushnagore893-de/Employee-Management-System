export interface createUserInterface {
  id?: number;
  first_name: string;
  middle_name?:string;
  last_name:string;
  email: string;
  phone:string;
  password: string;
  role_id: string;
  is_active?: boolean;
}

export interface updateUserInterface {
  id?: number;
  first_name: string;
  middle_name?:string;
  last_name:string;
  email: string;
  phone:string;
  password: string;
}