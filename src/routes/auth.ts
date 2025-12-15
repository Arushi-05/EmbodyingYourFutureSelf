
import { Router } from "express";
import { authUser } from "../middlewares/userAuth"
import { prisma } from '../client'
import express from "express";
import { validateSignup } from '../utils/validators'
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHashedPassword, signUpUser, getJwtToken, } from "../services/service"
const app = express();
import type { AuthRequest } from '../utils/types'
const router = Router();

Intl.DateTimeFormat().resolvedOptions().timeZone;
router.get("/", (req: Request, res: Response) => {
    res.send("Express + Prisma v7 API is running 🚀");
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const loggedInUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!loggedInUser) {
            throw new Error("User not found!")
        }
        const match = await bcrypt.compare(password, loggedInUser.password)
        if (match) {
            //const name=loggedInUser.name
            const token = await getJwtToken(loggedInUser)
            console.log("Login token", token)
            res.cookie("token", token)
            res.json({ message: `${loggedInUser?.name} loggedin successfully` , loggedInUser})
        }

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message)
        } else {
            console.error(err);
        }

    }
})

router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { email, password, name, timezone } = req.body
        //const hashOfYourpassword = createHashedPassword(password)
        const errors = validateSignup({ email, password, name });

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        await signUpUser(email, password, name, timezone)
        const token = await getJwtToken(req.body)
        console.log(token)
        res.cookie("token", token)
        res.json({ message: "User sign up successfull!" })
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message)
        } else {
            console.error(err);
        }

    }
})

router.post("/logout", authUser, async (req: AuthRequest, res: Response) => {
    const { token } = req.cookies
    const user = req.user
    if (!token) {
        throw new Error("Please login to logout man!")
    }
    // const name = req.user?.name;
    // res.clearCookie("token", {
    //   httpOnly: true
    // });
    // res.send(`${name ?? "User"} logged out successfully!`);
    res.cookie("token", "", { expires: new Date(0) })
    res.send(`${user?.name} is logged out!`);
})

export default router;