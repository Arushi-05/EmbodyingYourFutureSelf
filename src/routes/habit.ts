
import { Router } from "express";
import { authUser } from "../middlewares/userAuth"
import { prisma } from '../client'
import express from "express";
import type { Frequency } from "../utils/types";
import type { Request, Response } from "express";
const app = express();
import { getUpdatedStreak } from "../utils/habitFrequency";
import type { AuthRequest } from '../utils/types'
const router = Router();
const ALLOWED_FREQUENCIES = ["daily", "weekly", "monthly"] as const;
import {completeHabit} from "../controllers/habit.controllers";
import { createHabitService, } from "../services/service";
const IST = "Asia/Kolkata";

router.post("/createhabit", authUser, async (req: AuthRequest, res: Response) => {
    try {
        const { name, frequency } = req.body
        if (typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ error: "Name is required and must be a non-empty string." });
        }
        const userFromReq = req.user;
        console.log(userFromReq)
        if (!userFromReq || !userFromReq.id) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const userId = Number(userFromReq.id);
        if (Number.isNaN(userId)) {
            return res.status(500).json({ error: "Invalid user id on request" });
        }
        const created = await createHabitService({
            userId,
            name,
            frequency,
        });


        return res.status(201).json({ message: "Habit created", created });
    } catch (err) {
        console.error("Create habit error:", err);
        return res.status(500).json({ error: "Server error" });
    }
})

router.get("/habits", authUser, async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUser = req.user
        if (!loggedInUser?.id) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const habits = await prisma.habit.findMany({ where: { userId: loggedInUser.id } });
        if (habits.length==0) {
            return res.status(401).json({ error: "No habits added yet! Add one now!" });
        }
        res.json(habits);
    } catch (err) {
        console.error("Error fetching habits:", err);
        res.status(500).json({ error: "Failed to fetch habits" });
    }
});

router.post("/habits/:id/complete", authUser, completeHabit);


export default router;