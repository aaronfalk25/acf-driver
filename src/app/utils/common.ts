export function isEmpty(obj: any): boolean {
    return Object.keys(obj ?? {} as Object).length === 0
}