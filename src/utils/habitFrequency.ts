import {
    isSameDay, isYesterday, subDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getUpdatedStreak({
    currentStreak,
    lastCompleted,
    userTimezone,
    nowUTC,
}: {

    currentStreak: number;
    lastCompleted: Date | null;
    userTimezone: string;
    nowUTC: Date;
}) {
    const nowUser = toZonedTime(nowUTC, userTimezone);
    const lastUser = lastCompleted
        ? toZonedTime(lastCompleted, userTimezone)
        : null;

    let newStreak = currentStreak;

    if (lastUser && isSameDay(lastUser, nowUser)) {
        return { shouldUpdate: false, newStreak };
    }
    newStreak = lastUser && isYesterday(lastUser) ? newStreak + 1 : 1;
    return { shouldUpdate: true, newStreak };
}

export function recomputeStreak(
    completions: Date[],
    now: Date = new Date()
): { streak: number; lastCompleted: Date | null } {

    if (completions.length === 0) {
        return { streak: 0, lastCompleted: null };
    }

    let streak = 0;
    let cursor = now;
    while (true) {
        if (!completions.some(c => isSameDay(c, cursor))) break;
        streak++;
        cursor = subDays(cursor, 1);
    }

    return {
        streak,
        lastCompleted: completions[0] ?? null
    };
}

