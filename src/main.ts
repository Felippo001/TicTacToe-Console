import { clearConsole, ConsoleOutput, print } from "./console";
import { Keypress, readConsoleInput, waitForKeypress } from "./input";
import { Scoreboard } from "./scoreboard";
import TicTacToe, { PlayerElement,TicTacToeElement } from "./tic_tac_toe";

let game : TicTacToe
let scoreboard : Scoreboard<PlayerElement>

initialize()

function initialize(){
  scoreboard = new Scoreboard()
  scoreboard.register('X', 'O')

  game = new TicTacToe({
    onGameStart: onGameEvent,
    onGameChange: onGameEvent,
    onGameEnd: onGameEnd
  })

  Keypress.on('e', (_a) => process.exit(1))
  Keypress.on('p', (_a) => displayScoreboard()) 

  game.start()
}

async function handleMarkInput(currentPlayer : PlayerElement) {
  const result = readConsoleInput(`${currentPlayer}: Please enter the position of your mark (Row:Column): `)
  try {
    const [row, column] = (await result).split(':')
    const rowIndex = parseInt(row)
    const columnIndex = parseInt(column)
    if(!rowIndex || !columnIndex) throw new Error('Your input is not valid')
    
    game.mark(rowIndex, columnIndex)
    
  } catch (error) {
    clearConsole()
    showGame()
    print((error as any).message)
    print("")
    handleMarkInput(currentPlayer)
  }
}


async function onGameEnd(winner : PlayerElement | null, matrix : TicTacToeElement[][]){
  showGame()
  const restartText = "Press enter to start a new round"
  
  if(winner == null)
  print(`The game ended in a tie. ${restartText}`)
  else{
    print(`${winner} won. ${restartText}`)
    scoreboard.increment(winner)
  }
  
  await waitForKeypress("return")
  
  game.start()
}

function onGameEvent(player : PlayerElement, matrix : TicTacToeElement[][]){
  showGame()
  handleMarkInput(player)
}

function showGame() {
  clearConsole()
  game.display()
  print("")
}

async function displayScoreboard(){
  const output = [...ConsoleOutput]
  clearConsole()
  
  scoreboard.display()
  
  print("Press enter to remain")
  await waitForKeypress('return')
  
  setTimeout(() => {
    clearConsole()
    print(output.join('\n'))
  }, 50)
  
}