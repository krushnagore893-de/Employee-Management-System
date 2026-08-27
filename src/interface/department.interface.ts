export interface createUserInterface {
  id: string;
  department_name: string;
  description?: string;
  company_id: string;
  is_active: boolean;
  is_deleted: boolean;
}

export interface updateUserInterface {
  id: string;
  department_name: string;
  description?: string;
  company_id: string;
  
}