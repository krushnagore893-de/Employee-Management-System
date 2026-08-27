import { FastifyInstance } from "fastify";

import EmployeeController from "../controllers/employee.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";


// Admin Role ID
const ADMIN_ROLE_ID =
    "ceb77592-f457-4a97-b955-7f14475d0bdf";


export default async function employeeRoutes(
    fastify: FastifyInstance
) {

    // =========================
    // Create Employee
    // Admin Only
    // =========================

    fastify.post(
        "/create-employee",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    ADMIN_ROLE_ID
                )
            ]
        },

        EmployeeController.createEmployee.bind(
            EmployeeController
        )
    );


    // =========================
    // Get All Employees
    // Login Required
    // =========================

    fastify.get(
        "/getAll-employee",
        {
            preHandler: [
                authMiddleware
            ]
        },

        EmployeeController.getAllEmployees.bind(
            EmployeeController
        )
    );


    // =========================
    // Get Employee By ID
    // Login Required
    // =========================

    fastify.get(
        "/get-employee/:id",
        {
            preHandler: [
                authMiddleware
            ]
        },

        EmployeeController.getEmployeeById.bind(
            EmployeeController
        )
    );


    // =========================
    // Update Employee
    // Admin Only
    // =========================

    fastify.put(
        "/update-employee/:id",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    ADMIN_ROLE_ID
                )
            ]
        },

        EmployeeController.updateEmployee.bind(
            EmployeeController
        )
    );


    // =========================
    // Delete Employee
    // Admin Only
    // =========================

    fastify.delete(
        "/delete-employee/:id",
        {
            preHandler: [
                authMiddleware,

                roleMiddleware(
                    ADMIN_ROLE_ID
                )
            ]
        },

        EmployeeController.deleteEmployee.bind(
            EmployeeController
        )
    );

}