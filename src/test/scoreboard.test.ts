import { Scoreboard } from "../scoreboard"
import { PlayerElement } from "../tic_tac_toe"


test('Scoreboard entries', () => {
    const scoreboard = new Scoreboard<PlayerElement>()


    expect(scoreboard.entries.get('O')).not.toBeDefined()
    expect(scoreboard.entries.get('X')).not.toBeDefined()


    scoreboard.register('O', 'X')
    
    expect(scoreboard.entries.get('O')).toBeDefined()
    expect(scoreboard.entries.get('X')).toBeDefined()
})