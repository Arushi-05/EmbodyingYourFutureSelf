import {isSameDay,isYesterday,isSameWeek,isSameMonth,} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { Frequency } from "./types";
export function getUpdatedStreak({
    frequency,
    currentStreak,
    lastCompleted,
    userTimezone,
    nowUTC,
}: {
    frequency: Frequency;
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

    switch (frequency) {
        case "daily":
            if (lastUser && isSameDay(lastUser, nowUser)) {
                return { shouldUpdate: false, newStreak };
            }
            newStreak =
                lastUser && isYesterday(lastUser) ? newStreak + 1 : 1;
            break;

        case "weekly":
            if (
                lastUser &&
                isSameWeek(lastUser, nowUser, { weekStartsOn: 1 })
            ) {
                return { shouldUpdate: false, newStreak };
            }
            newStreak = lastUser ? newStreak + 1 : 1;
            break;

        case "monthly":
            if (lastUser && isSameMonth(lastUser, nowUser)) {
                return { shouldUpdate: false, newStreak };
            }
            newStreak = lastUser ? newStreak + 1 : 1;
            break;
    }

    return { shouldUpdate: true, newStreak };
}

