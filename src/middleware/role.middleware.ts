import {
    FastifyRequest,
    FastifyReply
} from "fastify";

export const roleMiddleware = (
    ...allowedRoles: string[]
) => {

    return async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {

        try {

            const user =
                (request as any).user;

            // Authentication check
            if (!user) {

                return reply.status(401).send({
                    success: false,
                    message: "Authentication required"
                });
            }

            // Get role_id from JWT
            const userRole =
                String(user.role_id).trim();

            // Allowed roles
            const allowed =
                allowedRoles.map(
                    role => String(role).trim()
                );

            console.log(
                "USER ROLE ID:",
                userRole
            );

            console.log(
                "ALLOWED ROLE IDs:",
                allowed
            );

            // Authorization check
            if (!allowed.includes(userRole)) {

                return reply.status(403).send({

                    success: false,

                    message:
                        "You do not have permission to access this resource",

                    user_role_id:
                        userRole,

                    allowed_role_ids:
                        allowed
                });
            }

        } catch (error: any) {

            return reply.status(403).send({

                success: false,

                message: "Forbidden",

                error: error.message
            });
        }
    };
};