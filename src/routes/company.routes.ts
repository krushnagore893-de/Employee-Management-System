import { FastifyInstance } from "fastify";

import companyController from "../controllers/company.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

async function companyRoutes(fastify: FastifyInstance) {

    // =========================
    // Create Company
    // =========================
    fastify.post(
        "/create-company",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },
        companyController.createCompany
    );


    // =========================
    // Get All Companies
    // Login Required
    // =========================
    fastify.get(
        "/getAll-company",
        {
            preHandler: [
                authMiddleware
            ]
        },
        companyController.getAllCompanies
    );


    // =========================
    // Get Company By ID
    // Admin Only
    // =========================
    fastify.get(
        "/company/:company_id",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },
        companyController.getCompanyById
    );


    // =========================
    // Update Company
    // Admin Only
    // =========================
    fastify.put(
        "/company/:company_id/update-company",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },
        companyController.updateCompany
    );


    // =========================
    // Delete Company
    // Admin Only
    // =========================
    fastify.delete(
        "/company/:company_id/delete-company",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },
        companyController.deleteCompany
    );
}

export default companyRoutes;