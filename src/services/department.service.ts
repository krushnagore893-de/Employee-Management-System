import { Op } from "sequelize";
import { Department } from "../models/department.model";
import { Company } from "../models/company.model";
import { Employee } from "../models/employee.model";

class DepartmentService {

    // =========================
    // Create Department
    // =========================
    async createDepartment(departmentData: any) {
        try {

            const existingDepartment =
                await Department.findOne({
                    where: {
                        department_name:
                            departmentData.department_name,
                        company_id:
                            departmentData.company_id
                    }
                });

            if (existingDepartment) {
                throw new Error(
                    "Department already exists"
                );
            }

            const department =
                await Department.create({
                    department_name:
                        departmentData.department_name,

                    description:
                        departmentData.description,

                    company_id:
                        departmentData.company_id,

                    is_active:
                        departmentData.is_active ?? true,

                    is_deleted:
                        departmentData.is_deleted ?? false
                });

            return department;

        } catch (error) {
            throw error;
        }
    }


    // =========================
    // Get All Departments
    // =========================
    async getAllDepartments(query: any = {}) {
        try {

            const {
                page = 1,
                limit = 10,
                search,
                company_id,
                sortBy = "created_at",
                sortOrder = "DESC"
            } = query;


            // Pagination
            const pageNumber =
                Number(page);

            const limitNumber =
                Number(limit);

            const offset =
                (pageNumber - 1) *
                limitNumber;


            // Where condition
            const whereCondition: any = {
                is_deleted: false
            };


            // Search
            if (search) {

                whereCondition[Op.or] = [
                    {
                        department_name: {
                            [Op.like]:
                                `%${search}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]:
                                `%${search}%`
                        }
                    }
                ];
            }


            // Company filter
            if (company_id) {

                whereCondition.company_id =
                    company_id;
            }


            // Get departments
            const { rows, count } =
                await Department.findAndCountAll({

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
                            model: Employee,
                            as: "employees",

                            attributes: [
                                "id",
                                "first_name",
                                "last_name",
                                "email"
                            ]
                        }
                    ],

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

                total: count,

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
    // Get Department By ID
    // =========================
    async getDepartmentById(
        departmentId: string
    ) {
        try {

            const department =
                await Department.findByPk(
                    departmentId,
                    {
                        include: [
                            {
                                model: Company,
                                as: "company",

                                attributes: [
                                    "id",
                                    "company_name",
                                    "email",
                                    "phone"
                                ]
                            },

                            {
                                model: Employee,
                                as: "employees",

                                attributes: [
                                    "id",
                                    "first_name",
                                    "last_name",
                                    "email"
                                ]
                            }
                        ]
                    }
                );


            if (!department) {

                throw new Error(
                    "Department not found"
                );
            }


            return department;

        } catch (error) {
            throw error;
        }
    }


    // =========================
    // Update Department
    // =========================
    async updateDepartment(
        departmentId: string,
        departmentData: any
    ) {
        try {

            const department =
                await Department.findByPk(
                    departmentId
                );


            if (!department) {

                throw new Error(
                    "Department not found"
                );
            }


            // Check duplicate department
            if (
                departmentData.department_name ||
                departmentData.company_id
            ) {

                const companyId =
                    departmentData.company_id ??
                    department.company_id;

                const departmentName =
                    departmentData.department_name ??
                    department.department_name;


                const existingDepartment =
                    await Department.findOne({

                        where: {

                            department_name:
                                departmentName,

                            company_id:
                                companyId,

                            id: {
                                [Op.ne]:
                                    departmentId
                            }
                        }
                    });


                if (existingDepartment) {

                    throw new Error(
                        "Department already exists"
                    );
                }
            }


            // Update
            await department.update(
                departmentData
            );


            // Get updated department
            const updatedDepartment =
                await Department.findByPk(
                    departmentId,
                    {
                        include: [
                            {
                                model: Company,
                                as: "company",

                                attributes: [
                                    "id",
                                    "company_name",
                                    "email",
                                    "phone"
                                ]
                            },

                            {
                                model: Employee,
                                as: "employees",

                                attributes: [
                                    "id",
                                    "first_name",
                                    "last_name",
                                    "email"
                                ]
                            }
                        ]
                    }
                );


            return updatedDepartment;

        } catch (error) {
            throw error;
        }
    }


    // =========================
    // Delete Department
    // =========================
    async deleteDepartment(
        departmentId: string
    ) {
        try {

            const department =
                await Department.findByPk(
                    departmentId
                );


            if (!department) {

                throw new Error(
                    "Department not found"
                );
            }


            // Check employees
            const employeeCount =
                await Employee.count({

                    where: {

                        department_id:
                            departmentId
                    }
                });


            if (employeeCount > 0) {

                throw new Error(
                    "Cannot delete department because employees are assigned to this department"
                );
            }


            // Delete
            await department.destroy();


            return {

                message:
                    "Department deleted successfully"
            };

        } catch (error) {
            throw error;
        }
    }
}


export default new DepartmentService();