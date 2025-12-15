import type { Response } from "express";
import { authUser } from "../middlewares/userAuth"
import type { AuthRequest } from '../utils/types'
//import type { AuthRequest } from "../middlewares/userAuth";
import {
  createHabitService,
  getUserHabitsService,
  completeHabitService,
} from "../services/service";

// export async function createHabit(req: AuthRequest, res: Response) {
//   try {
//     const { name, frequency } = req.body;
//     const userId = Number(req.user?.id);

//     const habit = await createHabitService({
//       userId,
//       name,
//       frequency,
//     });

//     res.status(201).json(habit);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// }

// export async function getUserHabits(req: AuthRequest, res: Response) {
//   try {
//     const userId = Number(req.user?.id);
//     const habits = await getUserHabitsService(userId);
//     res.json(habits);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch habits" });
//   }
// }

export async function completeHabit(req: AuthRequest, res: Response) {
  try {
    const habitId = Number(req.params.id);
    const userId = Number(req.user?.id);

    const habit = await completeHabitService({
      habitId,
      userId,
    });

    res.json({ message: "Habit completed", habit });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
