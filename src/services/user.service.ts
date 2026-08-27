
import { Op } from "sequelize";
import bcrypt from "bcrypt";

import { User } from "../models/user.model";
import { Role } from "../models/role.model";

import { generateToken } from "../utils/jwt";


class UserService {

    // =========================
    // Create User
    // =========================

    async createUser(userData: any) {

        try {

            // =========================
            // Required Fields
            // =========================

            if (!userData.first_name) {
                throw new Error("First name is required");
            }

            if (!userData.last_name) {
                throw new Error("Last name is required");
            }

            if (!userData.email) {
                throw new Error("Email is required");
            }

            if (!userData.phone) {
                throw new Error("Phone number is required");
            }

            if (!userData.password) {
                throw new Error("Password is required");
            }

            if (!userData.role_id) {
                throw new Error("Role ID is required");
            }


            // =========================
            // Email Validation
            // =========================

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(userData.email)) {

                throw new Error(
                    "Invalid email format"
                );

            }


            // =========================
            // Phone Validation
            // Exactly 10 digits
            // =========================

            const phoneRegex =
                /^[0-9]{10}$/;

            if (!phoneRegex.test(userData.phone)) {

                throw new Error(
                    "Phone number must be exactly 10 digits"
                );

            }


            // =========================
            // Password Validation
            // Minimum 8 characters
            // =========================

            if (userData.password.length < 8) {

                throw new Error(
                    "Password must be at least 8 characters"
                );

            }


            // =========================
            // Check Role Exists
            // =========================

            const role =
                await Role.findOne({

                    where: {
                        id: userData.role_id
                    }

                });


            if (!role) {

                throw new Error(
                    "Role not found"
                );

            }


            // =========================
            // Check Existing User
            // =========================

            const existingUser =
                await User.findOne({

                    where: {

                        email: userData.email,

                        is_deleted: false

                    }

                });


            if (existingUser) {

                throw new Error(
                    "User already exists"
                );

            }


            // =========================
            // Hash Password
            // =========================

            const hashPassword =
                await bcrypt.hash(
                    userData.password,
                    10
                );


            // =========================
            // Create User
            // =========================

            const user =
                await User.create({

                    ...userData,

                    password: hashPassword,

                    is_active: true,

                    is_deleted: false

                });


            // =========================
            // Remove Password
            // =========================

            const userResponse =
                user.toJSON();

            delete userResponse.password;


            return userResponse;


        } catch (error) {

            throw error;

        }

    }


    // =========================
    // Get All Users
    // =========================

    async getAllUsers(query: any = {}) {

        try {

            const {

                page = 1,

                limit = 10,

                search,

                role_id,

                sortBy = "created_at",

                sortOrder = "DESC"

            } = query;


            // =========================
            // Pagination
            // =========================

            const pageNumber =
                Number(page);

            const limitNumber =
                Number(limit);

            const offset =
                (pageNumber - 1) *
                limitNumber;


            // =========================
            // Where Condition
            // =========================

            const whereCondition: any = {

                is_deleted: false

            };


            // =========================
            // Search
            // =========================

            if (search) {

                whereCondition[Op.or] = [

                    {
                        first_name: {

                            [Op.like]:
                                `%${search}%`

                        }

                    },

                    {
                        last_name: {

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


            // =========================
            // Role Filter
            // =========================

            if (role_id) {

                whereCondition.role_id =
                    role_id;

            }


            // =========================
            // Get Users
            // =========================

            const {
                rows,
                count
            } =
                await User.findAndCountAll({

                    where:
                        whereCondition,

                    include: [

                        {

                            model: Role,

                            as: "role",

                            attributes: [

                                "id",

                                "role_name"

                            ]

                        }

                    ],

                    attributes: {

                        exclude: [

                            "password"

                        ]

                    },

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

                total:
                    count,

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
    // Get User By ID
    // =========================

    async getUserById(
        userId: any
    ) {

        try {

            const user =
                await User.findOne({

                    where: {

                        id: userId,

                        is_deleted: false

                    },

                    include: [

                        {

                            model: Role,

                            as: "role",

                            attributes: [

                                "id",

                                "role_name"

                            ]

                        }

                    ],

                    attributes: {

                        exclude: [

                            "password"

                        ]

                    }

                });


            if (!user) {

                throw new Error(
                    "User not found"
                );

            }


            return user;


        } catch (error) {

            throw error;

        }

    }


    // =========================
    // Update User
    // =========================

    async updateUser(
        userId: any,
        data: any
    ) {

        try {

            // =========================
            // Find User
            // =========================

            const user =
                await User.findOne({

                    where: {

                        id: userId,

                        is_deleted: false

                    }

                });


            if (!user) {

                throw new Error(
                    "User not found"
                );

            }


            // =========================
            // Email Validation
            // =========================

            if (data.email) {

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !emailRegex.test(
                        data.email
                    )
                ) {

                    throw new Error(
                        "Invalid email format"
                    );

                }


                // =========================
                // Check Duplicate Email
                // =========================

                const existingUser =
                    await User.findOne({

                        where: {

                            email:
                                data.email,

                            id: {

                                [Op.ne]:
                                    userId

                            },

                            is_deleted:
                                false

                        }

                    });


                if (existingUser) {

                    throw new Error(
                        "Email already exists"
                    );

                }

            }


            // =========================
            // Phone Validation
            // =========================

            if (data.phone) {

                const phoneRegex =
                    /^[0-9]{10}$/;

                if (
                    !phoneRegex.test(
                        data.phone
                    )
                ) {

                    throw new Error(
                        "Phone number must be exactly 10 digits"
                    );

                }

            }


            // =========================
            // Password Validation
            // =========================

            if (data.password) {

                if (
                    data.password.length < 8
                ) {

                    throw new Error(
                        "Password must be at least 8 characters"
                    );

                }


                data.password =
                    await bcrypt.hash(
                        data.password,
                        10
                    );

            }


            // =========================
            // Role Validation
            // =========================

            if (data.role_id) {

                const role =
                    await Role.findOne({

                        where: {

                            id:
                                data.role_id

                        }

                    });


                if (!role) {

                    throw new Error(
                        "Role not found"
                    );

                }

            }


            // =========================
            // Update User
            // =========================

            await user.update(
                data
            );


            // =========================
            // Return Updated User
            // =========================

            const updatedUser =
                await User.findOne({

                    where: {

                        id: userId,

                        is_deleted: false

                    },

                    include: [

                        {

                            model: Role,

                            as: "role",

                            attributes: [

                                "id",

                                "role_name"

                            ]

                        }

                    ],

                    attributes: {

                        exclude: [

                            "password"

                        ]

                    }

                });


            return updatedUser;


        } catch (error) {

            throw error;

        }

    }


    // =========================
    // Soft Delete User
    // =========================

    async deleteUser(
        userId: any
    ) {

        try {

            const user =
                await User.findOne({

                    where: {

                        id: userId,

                        is_deleted: false

                    }

                });


            if (!user) {

                throw new Error(
                    "User not found"
                );

            }


            await user.update({

                is_deleted: true,

                is_active: false

            });


            return {

                message:
                    "User deleted successfully"

            };


        } catch (error) {

            throw error;

        }

    }


    // =========================
    // Login User
    // =========================

    async login(
        email: string,
        password: string
    ) {

        try {

            // =========================
            // Required Fields
            // =========================

            if (!email) {

                return {

                    success: false,

                    message:
                        "Email is required"

                };

            }


            if (!password) {

                return {

                    success: false,

                    message:
                        "Password is required"

                };

            }


            // =========================
            // Find User
            // =========================

            const user =
                await User.findOne({

                    where: {

                        email: email

                    }

                });


            if (!user) {

                return {

                    success: false,

                    message:
                        "User not found"

                };

            }


            // =========================
            // Check Deleted
            // =========================

            if (user.is_deleted) {

                return {

                    success: false,

                    message:
                        "User account has been deleted"

                };

            }


            // =========================
            // Check Active
            // =========================

            if (!user.is_active) {

                return {

                    success: false,

                    message:
                        "User account is inactive"

                };

            }


            // =========================
            // Compare Password
            // =========================

            const isPasswordValid =
                await bcrypt.compare(

                    password,

                    user.password

                );


            if (!isPasswordValid) {

                return {

                    success: false,

                    message:
                        "Password is incorrect"

                };

            }


            // =========================
            // Generate JWT
            // =========================

            const token =
                generateToken({

                    id:
                        user.id,

                    email:
                        user.email,

                    role_id:
                        user.role_id

                });


            // =========================
            // Login Success
            // =========================

            return {

                success: true,

                message:
                    "Login successful",

                data: {

                    id:
                        user.id,

                    first_name:
                        user.first_name,

                    last_name:
                        user.last_name,

                    email:
                        user.email,

                    role_id:
                        user.role_id,

                    token:
                        token

                }

            };


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            throw error;

        }

    }

}


export default new UserService();
