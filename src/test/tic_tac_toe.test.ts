// import { assertEquals, assert } from "https://deno.land/std@0.198.0/assert/mod.ts";
import TicTacToe, { TicTacToeElement } from "../tic_tac_toe";



test('Initialize grid', () => {
  const game : any = new TicTacToe()
  game.initializeMatrix()

  expect(game.matrix).toBeDefined()

  for(const y of game.matrix)
    for(const x of y)
      expect(x).toBe(' ')


  expect(game.matrix![0]).not.toBe(game.matrix![1])
})


test('Check horizontal winner', () => {
  const game : any  = new TicTacToe();

  game.currentPlayer = 'X';

  game.matrix = [
    [' ', 'O', 'X'],
    ['X', 'X', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkHorizontal()).toBe(true);

  game.currentPlayer = 'O';
  game.matrix = [
    [' ', 'O', 'X'],
    ['O', 'O', 'O'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkHorizontal()).toBe(true);

  game.matrix = [
    [' ', 'O', 'X'],
    ['X', 'O', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkHorizontal()).toBe(false);

  game.matrix = [
    [' ', ' ', ' '],
    ['X', 'O', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkHorizontal()).toBe(false);
});

test('Check vertical winner', () => {
  const game : any = new TicTacToe();

  game.currentPlayer = 'X';

  game.matrix = [
    [' ', 'O', 'X'],
    ['X', 'X', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkVertical()).toBe(true);

  game.matrix = [
    [' ', 'O', ' '],
    ['X', 'O', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkVertical()).toBe(false);

  game.currentPlayer = 'O';
  game.matrix = [
    [' ', 'O', 'X'],
    [' ', 'O', ' '],
    [' ', 'O', 'X'],
  ];

  expect(game.checkVertical()).toBe(true);
});

test('Check diagonal winner', () => {
  const game : any = new TicTacToe();

  game.currentPlayer = 'X';

  game.matrix = [
    [' ', 'O', 'X'],
    ['X', 'X', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkDiagonal()).toBe(true);

  game.matrix = [
    [' ', 'O', ' '],
    ['X', 'O', 'X'],
    ['X', 'O', 'X'],
  ];

  expect(game.checkDiagonal()).toBe(false);

  game.currentPlayer = 'O';
  game.matrix = [
    [' ', 'O', ' '],
    [' ', ' ', ' '],
    [' ', 'O', 'X'],
  ];

  expect(game.checkDiagonal()).toBe(false);
});

test('Mark grid with X and O', () => {
  const game : any = new TicTacToe();
  game.start();

  expect(game.currentPlayer).toBe('X');

  const deepCopy = JSON.parse(JSON.stringify(game.matrix)) as TicTacToeElement[][];
  expect(game.matrix[0][0]).toBe(' ');

  game.mark(1, 1);

  expect(game.matrix[0][0]).toBe('X');

  for (let i = 0; i < game.matrix.length; i++) {
    for (let j = 0; j < game.matrix[i].length; j++) {
      if (i === 0 && j === 0) {
        expect(game.matrix[i][j]).toBe('X');
      } else {
        expect(game.matrix[i][j]).toBe(deepCopy[i][j]);
      }
    }
  }

  expect(game.currentPlayer).toBe('O');

  let errorThrown = false;
  try {
    game.mark(1, 1);
  } catch (error) {
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);

  expect(game.currentPlayer).toBe('O');
  expect(game.matrix[0][0]).toBe('X');

  game.mark(2, 1);

  expect(game.matrix[1][0]).toBe('O');
  expect(game.currentPlayer).toBe('X');
});

test('Game start callback', () => {
  let started = false;

  const game : any = new TicTacToe({
    onGameStart: (_a, _b) => (started = true),
  });

  expect(started).toBe(false);

  let errorThrown = false;
  try {
    game.mark(1, 2);
  } catch (_error) {
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);

  game.start();

  expect(started).toBe(true);

  errorThrown = false;
  try {
    game.mark(1, 2);
  } catch (_error) {
    errorThrown = true;
  }
  expect(errorThrown).toBe(false);

  errorThrown = false;
  try {
    game.start();
  } catch (_error) {
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);
});

test('Game ends in tie', () => {
  let winner : any = '___';
  const game : any = new TicTacToe({
    onGameEnd: (w, _b) => (winner = w),
  });

  /**
   * X X O
   * O O X
   * X O X
   */
  game.start();

  game.mark(1, 1);
  game.mark(1, 3);
  game.mark(1, 2);

  game.mark(2, 1);
  game.mark(2, 3);
  game.mark(2, 2);

  game.mark(3, 1);
  game.mark(3, 2);
  game.mark(3, 3);

  expect(winner).toBe(null);
  expect(game.currentPlayer).toBe('X');
});

test('Game ends in win X then O', () => {
  let winner : any = '___';
  const game : any = new TicTacToe({
    onGameEnd: (w, _b) => (winner = w),
  });
    /**
   * X _ O
   * O X X
   * _ _ X
   */

  game.start();

  game.mark(1, 1);
  game.mark(1, 3);
  game.mark(2, 2);

  game.mark(2, 1);
  game.mark(2, 3);
  game.mark(3, 2);

  expect(game.isRunning).toBe(true);

  game.mark(3, 3);

  expect(game.isRunning).toBe(false);

  expect(winner).toBe('X');
  expect(game.currentPlayer).toBe('X');

  game.start();

  expect(game.isRunning).toBe(true);

  /**
   * X O X
   * _ O _
   * X O _
   */

  game.mark(1, 1);
  game.mark(1, 2);
  game.mark(1, 3);
  game.mark(2, 2);
  game.mark(3, 1);
  game.mark(3, 2);

  expect(winner).toBe('O');
  expect(game.currentPlayer).toBe('O');
});
