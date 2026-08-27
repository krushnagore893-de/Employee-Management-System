import {
    FastifyRequest,
    FastifyReply
} from "fastify";

import userMappingService from "../services/userMappingService";


class UserMappingController {


    // ==========================================
    // Create User Mapping
    // ==========================================

    async createUserMapping(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        try {

            const data =
                request.body as any;


            const response =
                await userMappingService
                    .createUserMapping(data);


            return reply
                .status(201)
                .send(response);

        } catch (error: any) {

            return reply
                .status(500)
                .send({

                    success: false,

                    message:
                        "Failed to create user mapping",

                    error:
                        error.message

                });

        }
    }


    // ==========================================
    // Get All User Mappings
    // ==========================================

    async getAllUserMappings(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        try {

            const response =
                await userMappingService
                    .getAllUserMappings();


            return reply
                .status(200)
                .send(response);

        } catch (error: any) {

            return reply
                .status(500)
                .send({

                    success: false,

                    message:
                        "Failed to fetch user mappings",

                    error:
                        error.message

                });

        }
    }


    // ==========================================
    // Get User Mapping By ID
    // ==========================================

    async getUserMappingById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        try {

            const {
                id
            } =
                request.params as {
                    id: string
                };


            const response =
                await userMappingService
                    .getUserMappingById(id);


            if (!response.success) {

                return reply
                    .status(404)
                    .send(response);

            }


            return reply
                .status(200)
                .send(response);

        } catch (error: any) {

            return reply
                .status(500)
                .send({

                    success: false,

                    message:
                        "Failed to fetch user mapping",

                    error:
                        error.message

                });

        }
    }


    // ==========================================
    // Update User Mapping
    // ==========================================

    async updateUserMapping(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        try {

            const {
                id
            } =
                request.params as {
                    id: string
                };


            const data =
                request.body as any;


            const response =
                await userMappingService
                    .updateUserMapping(
                        id,
                        data
                    );


            if (!response.success) {

                return reply
                    .status(404)
                    .send(response);

            }


            return reply
                .status(200)
                .send(response);

        } catch (error: any) {

            return reply
                .status(500)
                .send({

                    success: false,

                    message:
                        "Failed to update user mapping",

                    error:
                        error.message

                });

        }
    }


    // ==========================================
    // Delete User Mapping
    // ==========================================

    async deleteUserMapping(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        try {

            const {
                id
            } =
                request.params as {
                    id: string
                };


            const response =
                await userMappingService
                    .deleteUserMapping(id);


            if (!response.success) {

                return reply
                    .status(404)
                    .send(response);

            }


            return reply
                .status(200)
                .send(response);

        } catch (error: any) {

            return reply
                .status(500)
                .send({

                    success: false,

                    message:
                        "Failed to delete user mapping",

                    error:
                        error.message

                });

        }
    }

}


export default new UserMappingController();