import {
    FastifyRequest,
    FastifyReply
} from "fastify";

import companyService from "../services/company.service";


class CompanyController {

    // Create Company
    async createCompany(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const companyData =
                request.body as any;

            const company =
                await companyService.createCompany(
                    companyData
                );

            return reply.status(201).send({
                message:
                    "Company created successfully",
                data: company
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Get All Companies
    async getAllCompanies(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const query =
                request.query as any;

            const companies =
                await companyService.getAllCompanies(
                    query
                );

            return reply.status(200).send({
                message:
                    "Companies fetched successfully",
                data: companies
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Get Company By ID
    async getCompanyById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { company_id } =
                request.params as {
                    company_id: string;
                };


            if (!company_id) {

                return reply.status(400).send({
                    message:
                        "Company ID is required"
                });
            }


            const company =
                await companyService.getCompanyById(
                    company_id
                );


            return reply.status(200).send({
                message:
                    "Company fetched successfully",
                data: company
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Update Company
    async updateCompany(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { company_id } =
                request.params as {
                    company_id: string;
                };

            const companyData =
                request.body as any;


            if (!company_id) {

                return reply.status(400).send({
                    message:
                        "Company ID is required"
                });
            }


            const company =
                await companyService.updateCompany(
                    company_id,
                    companyData
                );


            return reply.status(200).send({
                message:
                    "Company updated successfully",
                data: company
            });

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }


    // Delete Company
    async deleteCompany(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { company_id } =
                request.params as {
                    company_id: string;
                };


            if (!company_id) {

                return reply.status(400).send({
                    message:
                        "Company ID is required"
                });
            }


            const result =
                await companyService.deleteCompany(
                    company_id
                );


            return reply.status(200).send(
                result
            );

        } catch (error: any) {

            return reply.status(500).send({
                message:
                    "Internal Server Error",
                error:
                    error.message
            });
        }
    }
}


export default new CompanyController();