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

export function formatDatetimeShort(date: Date | string | null | undefined): string {
    if (!date) {
        return "";
    }

    if (typeof date === "string") {
        date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}