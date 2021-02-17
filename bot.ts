import stringToBoard from './utils/stringToBoard';

const main = (): void => {
  // TODO: Make this from the CLI
  const inputString =
    // force newline
    // `123456789qwertyuiopasdfghjklzxcvbnm1234567`;
    '0000000' + '0000000' + '0000000' + '0000000' + '0000000' + '0000000';
  const originalBoard = stringToBoard(inputString, 7, 6);
  // originalBoard.printBoard();

  const start = Date.now();
  console.log(originalBoard.getBestMove(1));

  const stop = Date.now();

  console.log('took', stop - start, 'ms');
};

main();
