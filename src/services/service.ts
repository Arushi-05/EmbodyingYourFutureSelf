import { prisma } from '../client'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { getUpdatedStreak } from "../utils/habitFrequency";
import type { Frequency } from "../utils/types";
export async function createHabitService({
  userId,
  name,
  frequency,
}: {
  userId: number;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
}) {
  return prisma.habit.create({
    data: {
      name,
      frequency,
      user: { connect: { id: userId } },
    },
  });
}

export async function getUserHabitsService(userId: number) {
  return prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
function normalizeFrequency(freq: string): Frequency {
  const value = freq.toLowerCase();
  if (value === "daily" || value === "weekly" || value === "monthly") {
    return value;
  }
  throw new Error("Invalid frequency");
}
export async function completeHabitService({
  habitId,
  userId,
}: {
  habitId: number;
  userId: number;
}) {

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    include: { user: { select: { timezone: true } } },
  });

  if (!habit) throw new Error("Habit not found");
  if (habit.userId !== userId) throw new Error("Forbidden");

  const { shouldUpdate, newStreak } = getUpdatedStreak({
    frequency: normalizeFrequency(habit.frequency),
    currentStreak: habit.currentStreak,
    lastCompleted: habit.lastCompleted,
    userTimezone: habit.user.timezone,
    nowUTC: new Date(),
  });

  if (!shouldUpdate) return habit;
  return prisma.habit.update({
    where: { id: habitId },
    data: {
      currentStreak: newStreak,
      lastCompleted: new Date(),
    },
  });
}

export async function createHashedPassword(password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed
}

export async function signUpUser(email: string, password: string, name: string, timezone: string) {

  const hashed = await createHashedPassword(password)
  const userTimezone =
    typeof timezone === "string" && timezone.length > 0
      ? timezone
      : "UTC";
  return await prisma.user.create({

    data: {
      email,
      password: hashed,
      name,
      timezone: userTimezone,
    },
    select: { id: true, email: true, name: true }
  });
}

export async function getJwtToken(user: { email: string; name: string }) {
  const payload = {
    email: user.email,
    name: user.name
  };
  const token = jwt.sign(payload, 'shhhhArushi05@', { expiresIn: "8d" });
  return token

  //res.send("New user added successfully.")
}


