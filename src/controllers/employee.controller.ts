import { FastifyRequest, FastifyReply } from "fastify";
import employeeService from "../services/employee.service";

class EmployeeController {

    // =========================
    // Create Employee
    // =========================
    async createEmployee(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const employeeData =
                request.body as any;

            // Debug - Request Body Check
            console.log(
                "EMPLOYEE REQUEST BODY:",
                employeeData
            );

            console.log(
                "company_id:",
                employeeData?.company_id
            );

            console.log(
                "department_id:",
                employeeData?.department_id
            );

            console.log(
                "role_id:",
                employeeData?.role_id
            );

            const response =
                await employeeService.createEmployee(
                    employeeData
                );

            return reply.status(201).send({

                message:
                    "Employee created successfully",

                data:
                    response

            });

        } catch (error: any) {

            console.error(
                "CREATE EMPLOYEE ERROR:",
                error
            );

            return reply.status(500).send({

                message:
                    "Internal Server Error",

                error:
                    error.message

            });
        }
    }


    // =========================
    // Get All Employees
    // =========================
    async getAllEmployees(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const query =
                request.query as any;

            const response =
                await employeeService.getAllEmployees(
                    query
                );

            return reply.status(200).send({

                message:
                    "Employees fetched successfully",

                data:
                    response

            });

        } catch (error: any) {

            console.error(
                "GET ALL EMPLOYEES ERROR:",
                error
            );

            return reply.status(500).send({

                message:
                    "Internal Server Error",

                error:
                    error.message

            });
        }
    }


    // =========================
    // Get Employee By ID
    // =========================
    async getEmployeeById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            console.log(
                "GET EMPLOYEE ID:",
                id
            );

            const response =
                await employeeService.getEmployeeById(
                    id
                );

            return reply.status(200).send({

                message:
                    "Employee fetched successfully",

                data:
                    response

            });

        } catch (error: any) {

            console.error(
                "GET EMPLOYEE ERROR:",
                error
            );

            return reply.status(404).send({

                message:
                    error.message

            });
        }
    }


    // =========================
    // Update Employee
    // =========================
    async updateEmployee(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            const employeeData =
                request.body as any;

            console.log(
                "UPDATE EMPLOYEE ID:",
                id
            );

            console.log(
                "UPDATE EMPLOYEE BODY:",
                employeeData
            );

            const response =
                await employeeService.updateEmployee(
                    id,
                    employeeData
                );

            return reply.status(200).send({

                message:
                    "Employee updated successfully",

                data:
                    response

            });

        } catch (error: any) {

            console.error(
                "UPDATE EMPLOYEE ERROR:",
                error
            );

            return reply.status(404).send({

                message:
                    error.message

            });
        }
    }


    // =========================
    // Delete Employee
    // =========================
    async deleteEmployee(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {

            const { id } =
                request.params as {
                    id: string;
                };

            console.log(
                "DELETE EMPLOYEE ID:",
                id
            );

            const response =
                await employeeService.deleteEmployee(
                    id
                );

            return reply.status(200).send(
                response
            );

        } catch (error: any) {

            console.error(
                "DELETE EMPLOYEE ERROR:",
                error
            );

            return reply.status(404).send({

                message:
                    error.message

            });
        }
    }

}

export default new EmployeeController();