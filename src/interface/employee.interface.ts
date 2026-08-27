export interface createUserInterface {
     id: string;
     first_name: string;
     middle_name?: string;
     last_name: string;
     email: string;
     phone: string;
     salary: number;
     joining_date: Date;
     company_id: string;
     department_id: string;
     role_id: string;

}

export interface updateUserInterface {
    id: string;
     first_name: string;
     middle_name?: string;
     last_name: string;
     email: string;
     phone: string;
     salary: number;
     joining_date: Date;
     company_id: string;
     department_id: string;
     role_id: string;
}