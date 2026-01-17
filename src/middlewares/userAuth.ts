import jwt from 'jsonwebtoken';
import { prisma } from '../client'
import type { AuthRequest } from '../utils/types'
import type { Request, Response, NextFunction } from "express";

export const authUser = async (req: AuthRequest, res: Response, next: NextFunction) => {

    console.log("entered authUser middleware")
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).send("Please login!")
        }
        const decoded = jwt.verify(token, "shhhhArushi05@");
        let payload: jwt.JwtPayload;
        try {

            if (typeof decoded === "string") {
                // should rarely happen if you sign objects, but guard anyway
                return res.status(401).send("Invalid token payload");
            }
            payload = decoded as jwt.JwtPayload;
            const email = (payload as any).email;

            if (!email) {
                return res.status(401).send("Token payload missing identifiers");
            }
            const foundUser = await prisma.user.findUnique({ where: { email: String(email) }, select: { email: true, name: true, id: true, timezone:true } });
            if (!foundUser) {
                return res.status(401).send("User not found during auth!");
            }
            req.user = { email: foundUser.email, name: foundUser.name, id: foundUser.id, timezone:foundUser.timezone };
            return next();

        } catch (err) {
            throw new Error("Invalid or expired token.");
        }

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message)
        } else {
            console.error(err);
        }
    }


}

