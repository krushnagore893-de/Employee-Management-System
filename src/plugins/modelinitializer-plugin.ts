import { Model, ModelStatic } from 'sequelize';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { User } from '../models/user.model';
import { Employee } from '../models/employee.model';
import { Company } from '../models/company.model';
import { Department } from '../models/department.model';
import { Role } from '../models/role.model';
import { UserMapping } from '../models/userMapping.model';


// ==========================================
// Fastify Models Declaration
// ==========================================

declare module 'fastify' {
    interface FastifyInstance {
        models: {
            User: ModelStatic<User>;
            Employee: ModelStatic<Employee>;
            Company: ModelStatic<Company>;
            Department: ModelStatic<Department>;
            Role: ModelStatic<Role>;
            UserMapping: ModelStatic<UserMapping>;
        };
    }
}


// ==========================================
// Model Initialization Plugin
// ==========================================

const modelInitializationPlugin: FastifyPluginAsync = fp(
    async (fastify) => {

        // ==========================================
        // Check Sequelize
        // ==========================================

        if (!fastify.sequelize) {
            throw new Error(
                'Sequelize instance not found. Ensure sequelize plugin is registered first.'
            );
        }


        // ==========================================
        // Initialize All Models
        // ==========================================

        const models = {

            User: User.initModel(
                fastify.sequelize
            ),

            Employee: Employee.initModel(
                fastify.sequelize
            ),

            Company: Company.initModel(
                fastify.sequelize
            ),

            Department: Department.initModel(
                fastify.sequelize
            ),

            Role: Role.initModel(
                fastify.sequelize
            ),

            UserMapping: UserMapping.initModel(
                fastify.sequelize
            )

        };


        // ==========================================
        // Decorate Fastify
        // ==========================================

        fastify.decorate(
            'models',
            models as {
                User: ModelStatic<User>;
                Employee: ModelStatic<Employee>;
                Company: ModelStatic<Company>;
                Department: ModelStatic<Department>;
                Role: ModelStatic<Role>;
                UserMapping: ModelStatic<UserMapping>;
            }
        );


        // ==========================================
        // Associations
        // ==========================================

        const setupAssociations = (
            modelMap: typeof models
        ) => {

            const {
                User,
                Employee,
                Company,
                Department,
                Role,
                UserMapping
            } = modelMap;


            // ==========================================
            // Company -> Department
            // ==========================================

            Company.hasMany(
                Department,
                {
                    foreignKey: "company_id",
                    as: "departments"
                }
            );


            Department.belongsTo(
                Company,
                {
                    foreignKey: "company_id",
                    as: "company"
                }
            );


            // ==========================================
            // Company -> Employee
            // ==========================================

            Company.hasMany(
                Employee,
                {
                    foreignKey: "company_id",
                    as: "employees"
                }
            );


            Employee.belongsTo(
                Company,
                {
                    foreignKey: "company_id",
                    as: "company"
                }
            );


            // ==========================================
            // Department -> Employee
            // ==========================================

            Department.hasMany(
                Employee,
                {
                    foreignKey: "department_id",
                    as: "employees"
                }
            );


            Employee.belongsTo(
                Department,
                {
                    foreignKey: "department_id",
                    as: "department"
                }
            );


            // ==========================================
            // Role -> Employee
            // ==========================================

            Role.hasMany(
                Employee,
                {
                    foreignKey: "role_id",
                    as: "employees"
                }
            );


            Employee.belongsTo(
                Role,
                {
                    foreignKey: "role_id",
                    as: "role"
                }
            );


            // ==========================================
            // Role -> User
            // ==========================================

            Role.hasMany(
                User,
                {
                    foreignKey: "role_id",
                    as: "users"
                }
            );


            User.belongsTo(
                Role,
                {
                    foreignKey: "role_id",
                    as: "role"
                }
            );


            // ==========================================
            // User -> UserMapping
            // ==========================================

            User.hasOne(
                UserMapping,
                {
                    foreignKey: "user_id",
                    as: "userMapping"
                }
            );


            UserMapping.belongsTo(
                User,
                {
                    foreignKey: "user_id",
                    as: "user"
                }
            );


            // ==========================================
            // Employee -> UserMapping
            // ==========================================

            Employee.hasOne(
                UserMapping,
                {
                    foreignKey: "employee_id",
                    as: "userMapping"
                }
            );


            UserMapping.belongsTo(
                Employee,
                {
                    foreignKey: "employee_id",
                    as: "employee"
                }
            );

        };


        // ==========================================
        // Setup Associations
        // ==========================================

        setupAssociations(models);


        // ==========================================
        // Success Log
        // ==========================================

        fastify.log.info(
            'Models initialized successfully'
        );

    }
);


export default modelInitializationPlugin;