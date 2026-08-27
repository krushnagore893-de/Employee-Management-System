import { Op } from "sequelize";

import { Company } from "../models/company.model";
import { Department } from "../models/department.model";
import { Employee } from "../models/employee.model";


class CompanyService {

    // Create Company
    async createCompany(companyData: any) {
        try {

            const existingCompany =
                await Company.findOne({
                    where: {
                        company_name:
                            companyData.company_name
                    }
                });


            if (existingCompany) {
                throw new Error(
                    "Company already exists"
                );
            }


            const company =
                await Company.create(
                    companyData
                );


            return company;

        } catch (error) {
            throw error;
        }
    }


    // Get All Companies
    async getAllCompanies(
        query: any = {}
    ) {
        try {

            const {
                page = 1,
                limit = 10,
                search,
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


            // Where Condition
            const whereCondition: any = {};


            // Search
            if (search) {

                whereCondition[Op.or] = [

                    {
                        company_name: {
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


            // Get Companies
            const {
                rows,
                count
            } =
                await Company.findAndCountAll({

                    where:
                        whereCondition,

                    attributes: {
                        exclude: []
                    },

                    include: [

                        {
                            model: Department,
                            as: "departments",

                            attributes: [
                                "id",
                                "department_name"
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

                page: pageNumber,

                limit: limitNumber,

                totalPages:
                    Math.ceil(
                        count /
                        limitNumber
                    ),

                data: rows
            };

        } catch (error) {
            throw error;
        }
    }


    // Get Company By ID
    async getCompanyById(
        companyId: string
    ) {
        try {

            const company =
                await Company.findByPk(
                    companyId,
                    {

                        include: [

                            {
                                model: Department,
                                as: "departments",

                                attributes: [
                                    "id",
                                    "department_name"
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


            if (!company) {

                throw new Error(
                    "Company not found"
                );

            }


            return company;

        } catch (error) {
            throw error;
        }
    }


    // Update Company
    async updateCompany(
        companyId: string,
        companyData: any
    ) {
        try {

            const company =
                await Company.findByPk(
                    companyId
                );


            if (!company) {

                throw new Error(
                    "Company not found"
                );

            }


            await company.update(
                companyData
            );


            return company;

        } catch (error) {
            throw error;
        }
    }


    // Delete Company
    async deleteCompany(
        companyId: string
    ) {
        try {

            const company =
                await Company.findByPk(
                    companyId
                );


            if (!company) {

                throw new Error(
                    "Company not found"
                );

            }


            await company.destroy();


            return {

                message:
                    "Company deleted successfully"

            };

        } catch (error) {
            throw error;
        }
    }

}


export default new CompanyService();