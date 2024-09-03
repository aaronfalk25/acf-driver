export function isEmpty(obj: any): boolean {
    return Object.keys(obj ?? {} as Object).length === 0
}

export function sortArray(array: any[] | null | undefined, key: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!array) {
        return [];
    }

    return array.sort((a, b) => {
        if (order === 'asc') {
            return a[key] - b[key];
        } else {
            return b[key] - a[key];
        }
    });
}

export function isMobile(): boolean {
    return window.innerWidth < 768;
}