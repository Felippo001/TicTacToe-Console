
export const ConsoleOutput : any[] = []

export function print(data: any, ...args: any[]) {
    console.log(data, ...args)
    ConsoleOutput.push(data)

}

export function clearConsole() {
    console.clear()
    ConsoleOutput.length = 0
}