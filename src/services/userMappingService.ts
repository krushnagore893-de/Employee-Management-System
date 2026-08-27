import { UserMapping } from "../models/userMapping.model";
import { User } from "../models/user.model";
import { Employee } from "../models/employee.model";

class UserMappingService {

    // ==========================================
    // CREATE USER MAPPING
    // ==========================================
    async createUserMapping(data: any) {

        try {

            // Check User
            const user = await User.findOne({
                where: {
                    id: data.user_id,
                    is_deleted: false
                }
            });

            if (!user) {

                return {
                    success: false,
                    message: "User not found"
                };
            }


            // Check Employee
            const employee = await Employee.findOne({
                where: {
                    id: data.employee_id,
                    is_deleted: false
                }
            });

            if (!employee) {

                return {
                    success: false,
                    message: "Employee not found"
                };
            }


            // Check existing mapping
            const existingMapping =
                await UserMapping.findOne({

                    where: {
                        user_id: data.user_id,
                        is_deleted: false
                    }

                });


            if (existingMapping) {

                return {
                    success: false,
                    message: "User mapping already exists"
                };
            }


            // Create Mapping
            const mapping =
                await UserMapping.create({

                    user_id: data.user_id,

                    employee_id:
                        data.employee_id,

                    is_active: true,

                    is_deleted: false

                });


            // Fetch created mapping with details
            const createdMapping =
                await UserMapping.findOne({

                    where: {
                        id: mapping.id
                    },

                    include: [

                        {
                            model: User,

                            as: "user",

                            attributes: [
                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone",
                                "role_id"
                            ]
                        },

                        {
                            model: Employee,

                            as: "employee",

                            attributes: [
                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone"
                            ]
                        }

                    ]

                });


            return {

                success: true,

                message:
                    "User mapping created successfully",

                data: createdMapping

            };

        } catch (error: any) {

            console.error(
                "Create User Mapping Error:",
                error
            );

            return {

                success: false,

                message:
                    "Failed to create user mapping",

                error: error.message

            };
        }
    }


    // ==========================================
    // GET ALL USER MAPPINGS
    // ==========================================
    async getAllUserMappings() {

        try {

            const mappings =
                await UserMapping.findAll({

                    where: {

                        is_deleted: false

                    },

                    include: [

                        {
                            model: User,

                            as: "user",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone",
                                "role_id"

                            ]
                        },


                        {
                            model: Employee,

                            as: "employee",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone"

                            ]
                        }

                    ],

                    order: [

                        [
                            "created_at",
                            "DESC"
                        ]

                    ]

                });


            return {

                success: true,

                message:
                    "User mappings fetched successfully",

                data: mappings

            };

        } catch (error: any) {

            console.error(
                "Get User Mappings Error:",
                error
            );

            return {

                success: false,

                message:
                    "Failed to fetch user mappings",

                error: error.message

            };
        }
    }


    // ==========================================
    // GET USER MAPPING BY ID
    // ==========================================
    async getUserMappingById(
        id: string
    ) {

        try {

            const mapping =
                await UserMapping.findOne({

                    where: {

                        id: id,

                        is_deleted: false

                    },

                    include: [

                        {
                            model: User,

                            as: "user",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone",
                                "role_id"

                            ]
                        },


                        {
                            model: Employee,

                            as: "employee",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone"

                            ]
                        }

                    ]

                });


            if (!mapping) {

                return {

                    success: false,

                    message:
                        "User mapping not found"

                };
            }


            return {

                success: true,

                message:
                    "User mapping fetched successfully",

                data: mapping

            };

        } catch (error: any) {

            return {

                success: false,

                message:
                    "Failed to fetch user mapping",

                error: error.message

            };
        }
    }


    // ==========================================
    // UPDATE USER MAPPING
    // ==========================================
    async updateUserMapping(
        id: string,
        data: any
    ) {

        try {

            const mapping =
                await UserMapping.findOne({

                    where: {

                        id: id,

                        is_deleted: false

                    }

                });


            if (!mapping) {

                return {

                    success: false,

                    message:
                        "User mapping not found"

                };
            }


            // Check new employee
            if (data.employee_id) {

                const employee =
                    await Employee.findOne({

                        where: {

                            id: data.employee_id,

                            is_deleted: false

                        }

                    });


                if (!employee) {

                    return {

                        success: false,

                        message:
                            "Employee not found"

                    };
                }
            }


            // Check new user
            if (data.user_id) {

                const user =
                    await User.findOne({

                        where: {

                            id: data.user_id,

                            is_deleted: false

                        }

                    });


                if (!user) {

                    return {

                        success: false,

                        message:
                            "User not found"

                    };
                }
            }


            await mapping.update({

                user_id:
                    data.user_id ??
                    mapping.user_id,

                employee_id:
                    data.employee_id ??
                    mapping.employee_id,

                is_active:
                    data.is_active ??
                    mapping.is_active,

                updated_at:
                    new Date()

            });


            const updatedMapping =
                await UserMapping.findOne({

                    where: {
                        id: id
                    },

                    include: [

                        {
                            model: User,

                            as: "user",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone",
                                "role_id"

                            ]
                        },


                        {
                            model: Employee,

                            as: "employee",

                            attributes: [

                                "id",
                                "first_name",
                                "middle_name",
                                "last_name",
                                "email",
                                "phone"

                            ]
                        }

                    ]

                });


            return {

                success: true,

                message:
                    "User mapping updated successfully",

                data: updatedMapping

            };

        } catch (error: any) {

            return {

                success: false,

                message:
                    "Failed to update user mapping",

                error: error.message

            };
        }
    }


    // ==========================================
    // DELETE USER MAPPING
    // ==========================================
    async deleteUserMapping(
        id: string
    ) {

        try {

            const mapping =
                await UserMapping.findOne({

                    where: {

                        id: id,

                        is_deleted: false

                    }

                });


            if (!mapping) {

                return {

                    success: false,

                    message:
                        "User mapping not found"

                };
            }


            // Soft delete
            await mapping.update({

                is_deleted: true,

                is_active: false,

                updated_at: new Date()

            });


            return {

                success: true,

                message:
                    "User mapping deleted successfully"

            };

        } catch (error: any) {

            return {

                success: false,

                message:
                    "Failed to delete user mapping",

                error: error.message

            };
        }
    }
}


export default new UserMappingService();