import { sortArray } from "./common";

export function formatDatetime(date: Date | string | null | undefined): string {
    if (!date) {
        return "";
    }

    if (typeof date === "string") {
        date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}