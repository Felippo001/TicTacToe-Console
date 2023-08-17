import { print } from "./console"


export class Scoreboard<T> {
    entries : Map<T,number>

    constructor(){
        this.entries = new Map()
    }

    increment(key : T) {
        const currentValue = this.entries.get(key)
        if(currentValue == null)
            throw new Error(`There is no entry for key ${key}`)
        this.entries.set(key, currentValue + 1)
    }

    register(...keys : T[]){
        for(const key of keys)
            this.entries.set(key, 0)
    }

    display(){
        let str = "Stats:"

        for(const [key, value] of this.entries)
            str += `\n${key} wins: ${value}`

        print(str)
    }

}