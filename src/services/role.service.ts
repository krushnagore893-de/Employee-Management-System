import { Op } from "sequelize";
import { Role } from "../models/role.model";
import { Employee } from "../models/employee.model";

class RoleService {

    // Create Role
    async createRole(roleData: any) {
        try {

            const existingRole =
                await Role.findOne({
                    where: {
                        role_name: roleData.role_name
                    }
                });

            if (existingRole) {
                throw new Error(
                    "Role already exists"
                );
            }

            const role =
                await Role.create(roleData);

            return role;

        } catch (error) {
            throw error;
        }
    }


    // Get All Roles
    async getAllRoles(query: any = {}) {
        try {

            const {
                page = 1,
                limit = 10,
                search,
                sortBy = "created_at",
                sortOrder = "DESC"
            } = query;

            // Pagination
            const pageNumber = Number(page);
            const limitNumber = Number(limit);

            const offset =
                (pageNumber - 1) * limitNumber;

            // Where Condition
            const whereCondition: any = {};

            // Search
            if (search) {

                whereCondition[Op.or] = [
                    {
                        role_name: {
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

            // Get Roles
            const { rows, count } =
                await Role.findAndCountAll({

                    where: whereCondition,

                    include: [
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
                            sortBy === "name"
                                ? "role_name"
                                : sortBy,
                            sortOrder.toUpperCase()
                        ]
                    ],

                    limit: limitNumber,

                    offset: offset
                });

            return {
                total: count,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(
                    count / limitNumber
                ),
                data: rows
            };

        } catch (error) {
            throw error;
        }
    }


    // Get Role By ID
    async getRoleById(
        roleId: string
    ) {
        try {

            const role =
                await Role.findByPk(
                    roleId,
                    {
                        include: [
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

            if (!role) {
                throw new Error(
                    "Role not found"
                );
            }

            return role;

        } catch (error) {
            throw error;
        }
    }


    // Update Role
    async updateRole(
        roleId: string,
        roleData: any
    ) {
        try {

            const role =
                await Role.findByPk(
                    roleId
                );

            if (!role) {
                throw new Error(
                    "Role not found"
                );
            }

            // Check duplicate role
            if (roleData.role_name) {

                const existingRole =
                    await Role.findOne({
                        where: {
                            role_name:
                                roleData.role_name,

                            id: {
                                [Op.ne]: roleId
                            }
                        }
                    });

                if (existingRole) {
                    throw new Error(
                        "Role already exists"
                    );
                }
            }

            // Update Role
            await role.update(
                roleData
            );

            // Get updated role
            const updatedRole =
                await Role.findByPk(
                    roleId,
                    {
                        include: [
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

            return updatedRole;

        } catch (error) {
            throw error;
        }
    }


    // Delete Role
    async deleteRole(
        roleId: string
    ) {
        try {

            const role =
                await Role.findByPk(
                    roleId
                );

            if (!role) {
                throw new Error(
                    "Role not found"
                );
            }

            // Check Employees
            const employeeCount =
                await Employee.count({
                    where: {
                        role_id: roleId
                    }
                });

            if (employeeCount > 0) {
                throw new Error(
                    "Cannot delete role because employees are assigned to this role"
                );
            }

            // Delete Role
            await role.destroy();
 
            return {
                message:
                    "Role deleted successfully"
            };

        } catch (error) {
            throw error;
        }
    }
}

export default new RoleService();