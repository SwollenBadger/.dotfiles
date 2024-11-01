export function nearest(number: number, numbers: number[]): number {
    return numbers.reduce((current, previous) => {
        return Math.abs(number - current) < Math.abs(previous - number)
            ? current
            : previous
    })
}
