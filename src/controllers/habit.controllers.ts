import type { Response } from "express";
import { authUser } from "../middlewares/userAuth"
import type { AuthRequest } from '../utils/types'
//import type { AuthRequest } from "../middlewares/userAuth";
import {
  createHabitService,
  deleteHabitService,
  completeHabitService,
  undoHabitService,
} from "../services/service";

export async function completeHabitController(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const habitId = Number(req.params.id);
      const userId = Number(req.user!.id);
  
      if (Number.isNaN(habitId)) {
        return res.status(400).json({ error: "Invalid habit id" });
      }
  
      const updatedHabit = await completeHabitService(habitId, userId);
  
      return res.status(200).json(updatedHabit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
export async function undoHabitController(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const habitId = Number(req.params.id);
      const userId = Number(req.user!.id);
  
      if (Number.isNaN(habitId)) {
        return res.status(400).json({ error: "Invalid habit id" });
      }
  
      const updatedHabit = await undoHabitService(habitId, userId);
  
      return res.status(200).json(updatedHabit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
  
export async function deleteHabit(req:AuthRequest, res:Response){
    try {
        const habitId = Number(req.params.id);
        const userId = Number(req.user?.id);
        const habit = await deleteHabitService({
          habitId,
          userId,
        });
    
        res.json({ message: "Habit deleted" });
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
}
