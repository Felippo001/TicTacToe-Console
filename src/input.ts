// import { readKeypress, readKeypressSync } from "https://deno.land/x/keypress@0.0.11/mod.ts";
// import { iterateReader } from "https://deno.land/std@0.198.0/streams/iterate_reader.ts";

import {createInterface} from 'readline'
import { ConsoleOutput } from './console';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});


export async function readConsoleInput(text = '') {
    return await new Promise<string>(resolve => {
        ConsoleOutput.push(text)
        rl.question(text, resolve)
    })
}

export async function waitForKeypress(key : string) {
    // process.stdin.setRawMode(true)

    const keypress = (resolve) => {
        const onKeypress = (_ch, k : Key) => {
            if(k.name != key)
                return;
            // process.stdin.setRawMode(false)
            process.stdin.removeListener('keypress', onKeypress)
            resolve(null)
        }
        process.stdin.on('keypress', onKeypress)
    }

    return new Promise(keypress)


}

type Key = {
    seqeuence: string,
    name: string,
    ctrl: boolean,
    meta: boolean,
    shift: boolean
}

type KeypressListener = (keypress : Key) => void

export class Keypress {
    private static listeners : {[key: string]: KeypressListener[]} = {}

    static {
        Keypress.initializeKeypressEvents()
    }

    private static async initializeKeypressEvents(){
        process.stdin.on('keypress', function (ch, key) {
            Keypress.listeners[key.name]?.forEach(fn => fn(key as Key))
        });
        
    }

    static on(key : string, listener : KeypressListener) {
        let arr = Keypress.listeners[key]
        if(!arr){
            arr = [] as KeypressListener[]
            Keypress.listeners[key] = arr
        }

        arr.push(listener)

    }
}





