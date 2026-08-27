import {
    FastifyRequest,
    FastifyReply
} from "fastify";

import { verifyToken } from "../utils/jwt";


// =========================
// JWT User Interface
// =========================

export interface JwtUser {
    id: string;
    email: string;
    role_id: string;
}


// =========================
// Auth Middleware
// =========================

export const authMiddleware = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {

    try {

        // =========================
        // Get Authorization Header
        // =========================

        const authHeader =
            request.headers.authorization;


        // =========================
        // Token Required
        // =========================

        if (!authHeader) {

            return reply.status(401).send({
                success: false,
                message: "Authorization token is required"
            });
        }


        // =========================
        // Check Bearer Format
        // =========================

        if (!authHeader.startsWith("Bearer ")) {

            return reply.status(401).send({
                success: false,
                message: "Invalid authorization format"
            });
        }


        // =========================
        // Get Token
        // =========================

        const token =
            authHeader.substring(7).trim();


        if (!token) {

            return reply.status(401).send({
                success: false,
                message: "Authorization token is required"
            });
        }


        // =========================
        // Verify Token
        // =========================

        const decoded =
            verifyToken(token) as JwtUser;


        // =========================
        // Check JWT Payload
        // =========================

        if (
            !decoded ||
            !decoded.id ||
            !decoded.email ||
            !decoded.role_id
        ) {

            return reply.status(401).send({
                success: false,
                message: "Invalid token"
            });
        }


        // =========================
        // Attach User To Request
        // =========================

        (request as any).user = {
            id: decoded.id,
            email: decoded.email,
            role_id: decoded.role_id
        };


        // =========================
        // Continue Request
        // =========================

        return;

    } catch (error: any) {

        return reply.status(401).send({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};