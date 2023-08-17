import { formatMatrix } from "./util"
import { print } from "./console"

export type PlayerElement = 'X' | 'O'
export type EmptyElement = ' '

export type TicTacToeElement = PlayerElement | EmptyElement

type OnGameStart = (startPlayer : PlayerElement, grid : TicTacToeElement[][]) => void
type OnGameChange = (nextPlayer : PlayerElement, grid : TicTacToeElement[][]) => void
type OnGameEnd = (winner : PlayerElement | null, grid : TicTacToeElement[][]) => void

export type TicTacToeParams = {
    gridSize?: number,
    onGameStart?: OnGameStart,
    onGameChange?: OnGameChange,
    onGameEnd?: OnGameEnd,
    startPlayer?: PlayerElement
}

const defaultArgs = {
    gridSize: 3,
    startPlayer: 'X',
    onGameChange: (_a, _b) => {},
    onGameStart: (_a, _b) => {},
    onGameEnd: (_a, _b) => {}
} as TicTacToeParams

export default class TicTacToe {
    private gridSize: number
    private matrix: TicTacToeElement[][] | undefined
    private startPlayer: PlayerElement
    private currentPlayer: PlayerElement
    private onGameStart: OnGameStart
    private onGameChange: OnGameChange
    private onGameEnd: OnGameEnd
    private turnCount: number
    private isRunning: boolean

    constructor(args : TicTacToeParams = {}) {
        args = {...defaultArgs, ...args} as TicTacToeParams
        this.gridSize = args.gridSize!
        this.startPlayer = args.startPlayer!
        this.currentPlayer = this.startPlayer

        this.onGameStart = args.onGameStart!
        this.onGameChange = args.onGameChange!
        this.onGameEnd = args.onGameEnd!
        this.turnCount = 0

        this.isRunning = false

    }

    initializeMatrix() {

        this.matrix = Array.from({
            length: this.gridSize
        }, () => 
            new Array(this.gridSize).fill(' ')
        ) as TicTacToeElement[][]
    }

    start(){
        if(this.isRunning)
            throw new Error('Game has already started')

        this.isRunning = true
        this.turnCount = 0
        this.initializeMatrix()

        this.onGameStart(this.currentPlayer, this.matrix!)
    }

    mark(row : number, column : number) {
        if(!this.isRunning)
            throw new Error('Game has not started yet')

        if(!this.isInputValid(row) || !this.isInputValid(column) || !this.isFieldValid(row, column))
            throw new Error(`Input ${row}:${column}\nThe inserted field is not valid. Try again`)

        this.matrix![row - 1][column - 1] = this.currentPlayer
        this.turnCount++

        const winner = this.checkGameEnd()
        if(winner){
            this.onGameEnd(
                winner == ' ' ? null : winner,
                this.matrix!
            )
            return
        }


        this.nextTurn()

        this.onGameChange(this.currentPlayer, this.matrix!)
    }

    private isInputValid(num : number) : boolean {
        return num >= 1 || num <= this.gridSize
    }

    private isFieldValid(row : number, column : number) : boolean {
        try{
            return this.matrix![row - 1][column - 1] == ' '
        } catch(_error){
            return false
        }
    }

    private nextTurn() {
        this.currentPlayer = this.currentPlayer == 'X' ? 'O' : 'X'
    }

    private checkGameEnd() : TicTacToeElement | null {
        const hasWon = this.checkHorizontal() || this.checkVertical() || this.checkDiagonal()
        const isTie = this.turnCount >= this.gridSize**2
        
        if(hasWon){
            this.isRunning = false
            this.startPlayer = this.currentPlayer
            return this.currentPlayer
        }

        if(isTie){
            this.isRunning = false
            this.startPlayer = 'X'
            return ' '
        }

        return null

    }

    private checkHorizontal() : boolean {
        return this.matrix!
            .some(row => row.every(col => col == this.currentPlayer))

    }

    private checkVertical() : boolean {
        for(let i=0; i<this.matrix![0].length; i++){
            let result = true
            for(let j=0; j<this.gridSize; j++)
                result &&= this.currentPlayer == this.matrix![j][i]

            if(result)
                return true
        } 

        return false
    }

    private checkDiagonal() : boolean {
        let downLine = true, upLine = true
            for(let i=0; i<this.gridSize; i++){
                downLine &&= this.currentPlayer == this.matrix![i][i]

                const leftBottomIndex = this.gridSize - 1
                upLine &&= this.currentPlayer == this.matrix![leftBottomIndex - i][i]

            }

        return downLine || upLine
    }

    display(){
        const formattedMatrix = formatMatrix(this.matrix!, '|', '-', 8)

        for(const row of formattedMatrix)
            print(row.join('\t'))

    }

    
}
