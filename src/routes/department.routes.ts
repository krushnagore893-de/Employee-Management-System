import { FastifyInstance } from "fastify";

import departmentController from "../controllers/department.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";


export default async function departmentRoutes(
    fastify: FastifyInstance
) {

    // =========================================
    // CREATE DEPARTMENT
    // =========================================

    fastify.post(
        "/create-department",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },

        departmentController.createDepartment
    );


    // =========================================
    // GET ALL DEPARTMENTS
    // =========================================

    fastify.get(
        "/get-all-departments",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },

        departmentController.getAllDepartments
    );


    // =========================================
    // GET DEPARTMENT BY ID
    // =========================================

    fastify.get(
        "/get-department/:id",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },

        departmentController.getDepartmentById
    );


    // =========================================
    // UPDATE DEPARTMENT
    // =========================================

    fastify.put(
        "/update-department/:id",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },

        departmentController.updateDepartment
    );


    // =========================================
    // DELETE DEPARTMENT
    // =========================================

    fastify.delete(
        "/delete-department/:id",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    "b6cb1244-841c-4484-bee2-a8ad679a2a3f"
                )
            ]
        },

        departmentController.deleteDepartment
    );
}