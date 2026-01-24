import { prisma } from '../client'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { getUpdatedStreak, recomputeStreak } from "../utils/habitFrequency";

export async function createHabitService({
  userId,
  name,
 
}: {
  userId: number;
  name: string;
 
}) {
  return prisma.habit.create({
    data: {
      name,
 
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


export async function completeHabitService(
  habitId: number,
  userId: number
) {
  // 1️⃣ Fetch habit & validate ownership
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: {
      id: true,
      name:true,
      userId: true,
    }
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  if (habit.userId !== userId) {
    throw new Error("Not authorized to complete this habit");
  }

  // 2️⃣ Create completion event (SOURCE OF TRUTH)
  await prisma.habitCompletion.create({
    data: { habitId }
  });

  // 3️⃣ Fetch full completion history (DESC order)
  const completions = await prisma.habitCompletion.findMany({
    where: { habitId },
    orderBy: { completedAt: "desc" }
  });

  // 4️⃣ Recompute streak (DERIVED STATE)
  const { streak, lastCompleted } = recomputeStreak(
    completions.map(c => c.completedAt)
  );

  // 5️⃣ Update habit with derived state
  const updatedHabit = await prisma.habit.update({
    where: { id: habitId },
    data: {
      currentStreak: streak,
      lastCompleted
    }
  });

  return updatedHabit;
}

export async function undoHabitService(
  habitId: number,
  userId: number
) {

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: {
      id: true,
      userId: true
    }
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  if (habit.userId !== userId) {
    throw new Error("Not authorized to undo this habit");
  }


  const latestCompletion = await prisma.habitCompletion.findFirst({
    where: { habitId },
    orderBy: { completedAt: "desc" }
  });

  if (!latestCompletion) {
    throw new Error("Nothing to undo");
  }

  // 3️⃣ Delete latest completion event
  await prisma.habitCompletion.delete({
    where: { id: latestCompletion.id }
  });

  // 4️⃣ Fetch updated completion history
  const completions = await prisma.habitCompletion.findMany({
    where: { habitId },
    orderBy: { completedAt: "desc" }
  });

  // 5️⃣ Recompute streak
  const { streak, lastCompleted } = recomputeStreak(
    completions.map(c => c.completedAt)
  );

  // 6️⃣ Update habit
  const updatedHabit = await prisma.habit.update({
    where: { id: habitId },
    data: {
      currentStreak: streak,
      lastCompleted
    }
  });

  return updatedHabit;
}


export async function deleteHabitService({habitId,
  userId,
}: {
  habitId: number;
  userId: number;
}
){
  const deletedHabit= await prisma.habit.delete({
    where: { id: habitId }
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



