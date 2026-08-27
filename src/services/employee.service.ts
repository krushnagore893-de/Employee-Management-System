import { Op } from "sequelize";

import { Employee } from "../models/employee.model";
import { Company } from "../models/company.model";
import { Department } from "../models/department.model";
import { Role } from "../models/role.model";

class EmployeeService {

    // =========================
    // Create Employee
    // =========================
    async createEmployee(employeeData: any) {
        try {

            // =========================
            // Required Fields Validation
            // =========================
            if (!employeeData.company_id) {
                throw new Error("company_id is required");
            }

            if (!employeeData.department_id) {
                throw new Error("department_id is required");
            }

            if (!employeeData.role_id) {
                throw new Error("role_id is required");
            }

            // =========================
            // Check Duplicate Email
            // =========================
            const existingEmployee =
                await Employee.findOne({
                    where: {
                        email: employeeData.email
                    }
                });

            if (existingEmployee) {
                throw new Error(
                    "Employee already exists"
                );
            }

            // =========================
            // Check Company
            // =========================
            const company =
                await Company.findOne({
                    where: {
                        id: employeeData.company_id
                    }
                });

            if (!company) {
                throw new Error(
                    "Company not found"
                );
            }

            // =========================
            // Check Department
            // =========================
            const department =
                await Department.findOne({
                    where: {
                        id: employeeData.department_id
                    }
                });

            if (!department) {
                throw new Error(
                    "Department not found"
                );
            }

            // =========================
            // Check Role
            // =========================
            const role =
                await Role.findOne({
                    where: {
                        id: employeeData.role_id
                    }
                });

            if (!role) {
                throw new Error(
                    "Role not found"
                );
            }

            // =========================
            // Create Employee
            // =========================
            const employee =
                await Employee.create(
                    employeeData
                );

            return employee;

        } catch (error) {
            throw error;
        }
    }


    // =========================
    // Get All Employees
    // =========================
    async getAllEmployees(query: any = {}) {
        try {

            const {
                page = 1,
                limit = 10,
                search,
                company_id,
                department_id,
                role_id,
                sortBy = "created_at",
                sortOrder = "DESC"
            } = query;

            // =========================
            // Pagination
            // =========================
            const pageNumber =
                Number(page);

            const limitNumber =
                Number(limit);

            const offset =
                (pageNumber - 1) *
                limitNumber;

            // =========================
            // Where Condition
            // =========================
            const whereCondition: any = {
                is_deleted: false
            };

            // =========================
            // Search
            // =========================
            if (search) {

                whereCondition[Op.or] = [

                    {
                        first_name: {
                            [Op.like]:
                                `%${search}%`
                        }
                    },

                    {
                        last_name: {
                            [Op.like]:
                                `%${search}%`
                        }
                    },

                    {
                        email: {
                            [Op.like]:
                                `%${search}%`
                        }
                    },

                    {
                        phone: {
                            [Op.like]:
                                `%${search}%`
                        }
                    }

                ];
            }

            // =========================
            // Company Filter
            // =========================
            if (company_id) {

                whereCondition.company_id =
                    company_id;

            }

            // =========================
            // Department Filter
            // =========================
            if (department_id) {

                whereCondition.department_id =
                    department_id;

            }

            // =========================
            // Role Filter
            // =========================
            if (role_id) {

                whereCondition.role_id =
                    role_id;

            }

            // =========================
            // Get Employees
            // =========================
            const {
                rows,
                count
            } =
                await Employee.findAndCountAll({

                    where:
                        whereCondition,

                    include: [

                        {
                            model: Company,

                            as: "company",

                            attributes: [
                                "id",
                                "company_name"
                            ]
                        },

                        {
                            model: Department,

                            as: "department",

                            attributes: [
                                "id",
                                "department_name"
                            ]
                        },

                        {
                            model: Role,

                            as: "role",

                            attributes: [
                                "id",
                                "role_name"
                            ]
                        }

                    ],

                    // =========================
                    // Sort
                    // =========================
                    order: [

                        [
                            sortBy,
                            sortOrder.toUpperCase()
                        ]

                    ],

                    limit:
                        limitNumber,

                    offset:
                        offset

                });

            return {

                total:
                    count,

                page:
                    pageNumber,

                limit:
                    limitNumber,

                totalPages:
                    Math.ceil(
                        count /
                        limitNumber
                    ),

                data:
                    rows

            };

        } catch (error) {

            throw error;

        }
    }


    // =========================
    // Get Employee By ID
    // =========================
    async getEmployeeById(
        employeeId: string
    ) {
        try {

            // =========================
            // Validate Employee ID
            // =========================
            if (!employeeId) {
                throw new Error(
                    "Employee ID is required"
                );
            }

            const employee =
                await Employee.findOne({

                    where: {

                        id:
                            employeeId,

                        is_deleted:
                            false

                    },

                    include: [

                        {
                            model: Company,

                            as: "company",

                            attributes: [
                                "id",
                                "company_name"
                            ]
                        },

                        {
                            model: Department,

                            as: "department",

                            attributes: [
                                "id",
                                "department_name"
                            ]
                        },

                        {
                            model: Role,

                            as: "role",

                            attributes: [
                                "id",
                                "role_name"
                            ]
                        }

                    ]

                });

            if (!employee) {

                throw new Error(
                    "Employee not found"
                );

            }

            return employee;

        } catch (error) {

            throw error;

        }
    }


    // =========================
    // Update Employee
    // =========================
    async updateEmployee(
        employeeId: string,
        employeeData: any
    ) {
        try {

            // =========================
            // Validate Employee ID
            // =========================
            if (!employeeId) {
                throw new Error(
                    "Employee ID is required"
                );
            }

            // =========================
            // Find Employee
            // =========================
            const employee =
                await Employee.findOne({

                    where: {

                        id:
                            employeeId,

                        is_deleted:
                            false

                    }

                });

            if (!employee) {

                throw new Error(
                    "Employee not found"
                );

            }

            // =========================
            // Check Duplicate Email
            // =========================
            if (employeeData.email) {

                const existingEmployee =
                    await Employee.findOne({

                        where: {

                            email:
                                employeeData.email,

                            id: {
                                [Op.ne]:
                                    employeeId
                            },

                            is_deleted:
                                false

                        }

                    });

                if (existingEmployee) {

                    throw new Error(
                        "Employee already exists with this email"
                    );

                }

            }

            // =========================
            // Check Company
            // =========================
            if (employeeData.company_id) {

                const company =
                    await Company.findOne({

                        where: {

                            id:
                                employeeData.company_id

                        }

                    });

                if (!company) {

                    throw new Error(
                        "Company not found"
                    );

                }

            }

            // =========================
            // Check Department
            // =========================
            if (employeeData.department_id) {

                const department =
                    await Department.findOne({

                        where: {

                            id:
                                employeeData.department_id

                        }

                    });

                if (!department) {

                    throw new Error(
                        "Department not found"
                    );

                }

            }

            // =========================
            // Check Role
            // =========================
            if (employeeData.role_id) {

                const role =
                    await Role.findOne({

                        where: {

                            id:
                                employeeData.role_id

                        }

                    });

                if (!role) {

                    throw new Error(
                        "Role not found"
                    );

                }

            }

            // =========================
            // Update Employee
            // =========================
            await employee.update(
                employeeData
            );

            // =========================
            // Get Updated Employee
            // =========================
            const updatedEmployee =
                await Employee.findOne({

                    where: {

                        id:
                            employeeId,

                        is_deleted:
                            false

                    },

                    include: [

                        {
                            model: Company,

                            as: "company",

                            attributes: [
                                "id",
                                "company_name"
                            ]
                        },

                        {
                            model: Department,

                            as: "department",

                            attributes: [
                                "id",
                                "department_name"
                            ]
                        },

                        {
                            model: Role,

                            as: "role",

                            attributes: [
                                "id",
                                "role_name"
                            ]
                        }

                    ]

                });

            return updatedEmployee;

        } catch (error) {

            throw error;

        }
    }


    // =========================
    // Delete Employee
    // =========================
    async deleteEmployee(
        employeeId: string
    ) {
        try {

            // =========================
            // Validate Employee ID
            // =========================
            if (!employeeId) {
                throw new Error(
                    "Employee ID is required"
                );
            }

            // =========================
            // Find Employee
            // =========================
            const employee =
                await Employee.findOne({

                    where: {

                        id:
                            employeeId,

                        is_deleted:
                            false

                    }

                });

            if (!employee) {

                throw new Error(
                    "Employee not found"
                );

            }

            // =========================
            // Soft Delete
            // =========================
            await employee.update({

                is_deleted:
                    true,

                is_active:
                    false

            });

            return {
                success:true, 
                message:
                    "Employee deleted successfully"

            };

        } catch (error) {

            throw error;

        }
    }

}

export default new EmployeeService();