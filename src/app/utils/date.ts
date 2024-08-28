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

export function sortArrayByDate(array: any[] | null | undefined, key: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!array) {
        return [];
    }

    array = array.map((item) => {
        return {
            ...item,
            [key]: new Date(item[key])
        }
    });

    sortArray(array, key, order);

    array = array.map((item) => {
        return {
            ...item,
            [key]: item[key].toISOString().slice(0, 10)
        }
    });

    return array;
}