// import { assertEquals } from "https://deno.land/std@0.198.0/assert/mod.ts";
import { readConsoleInput } from "../input";


test('Read input from console', async ()  => {
    const testString = "ABC\n";



    process.stdin.push(
      Buffer.from(testString)
    )
    process.stdin.push(null)
    
    const userInput = await readConsoleInput();
    expect(userInput).toBe("ABC");
});