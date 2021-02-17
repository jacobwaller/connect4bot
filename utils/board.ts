import Tree from './tree';

type Move = {
  colulmn: number;
  color: number;
};

class ScoreStore {
  move: number;
  rollingAverageScore: number;
  scoreCount: number;

  constructor(move: number) {
    this.move = move;
  }

  addAverage(num: number) {
    // ((old count * old data) + next data) / next count
    this.rollingAverageScore =
      (this.scoreCount * this.rollingAverageScore + num) /
      (this.scoreCount + 1);

    this.scoreCount += 1;
  }
}

class Board {
  arr: number[][];
  score: number | undefined = undefined;
  private height: number;
  private width: number;
  private moveList: Array<Move>;

  // Need both. Root node will have rootScoresList and
  // each child will have score tracker populated with
  // an object from the list
  private rootScoresList: Array<ScoreStore> = [];
  private scoreTracker: ScoreStore;

  constructor(arr: Array<Array<number>>) {
    this.arr = arr;
    this.height = arr.length;
    this.width = arr[0].length;
    this.moveList = [];
  }

  /**
   * Search for 3 in a row for any color
   * return -1 if winning move for the opposite color
   * return 1 if winning move for our color
   * return 0 if no winning move exists
   * @param color
   */
  doesWinningMoveExist(color: number) {}

  /**
   * Search for pattern like:
   * xxwwxxx
   * xxbbbxx
   * where no matter what move w makes,
   * b still has a winning move
   *
   * return -1 if winning move for the opposite color
   * return 1 if winning move for our color
   * return 0 if no winning move exists
   * @param color
   */
  isWinningForced(color: number) {}

  /**
   * Returns the length of the longest current row by
   * the passed color
   * @param color
   */
  longestRow(color: number) {}

  scoreBoard(): number {
    if (this.score === undefined) {
      // Calculate score
      // TODO: Calculate the score
      this.score = 1;
    }
    // TODO: literally the programmatically hardest part
    return this.score;
  }

  getPossibleMoves(): Array<number> {
    return this.arr[0].filter((item) => item === 0).map((item, index) => index);
  }

  // Computationally the hardest part
  getBestMove(colorsMove: number): number {
    const t: Tree = new Tree(this);

    let cnt = 0;
    let winningMove = -1;

    const queue = [t];

    // Temporary, until we set a computational time limit and do async
    while (cnt < 50000 && winningMove < 0) {
      // Dequeue front
      const curr = queue.shift();

      // Add a score
      curr.data.scoreBoard();

      // This is comicly bad on purpose
      // curr.data.printBoard();
      const currColor =
        curr.data.moveList.length === 0
          ? colorsMove
          : curr.data.moveList[curr.data.moveList.length - 1].color === 1
          ? 2
          : 1;

      const possibleMoves = curr.data.getPossibleMoves();

      // Add possible moves to queue
      const possibleNextBoards = possibleMoves.map((item) =>
        curr.data.makeMove(item, currColor)
      );

      // Possible optimization: if our score drops below a threshold, throw it away
      possibleNextBoards.forEach((item) => {
        const n = curr.addChild(item);
        queue.push(n);
      });

      // If we're doing the first layer (OUR possible moves)
      if (cnt === 0) {
        // Then
        // Populate our scoreList with new objects
        possibleNextBoards.forEach((item) => {
          const scr: ScoreStore = new ScoreStore(
            item.moveList[item.moveList.length - 1].colulmn
          );
          scr.move = item.moveList[item.moveList.length - 1].colulmn;
          scr.rollingAverageScore = 0;
          scr.scoreCount = 0;

          curr.data.rootScoresList.push(scr);
          item.scoreTracker = scr;
        });
      } else {
        // Else (working on deeper layers)
        // Calculate our current score
        const currScore = curr.data.scoreBoard();
        if (colorsMove === currColor) {
          // If color == curColor
          // Add that number to our score tracker
          // curr.data.scoreTracker.rollingAverageScore += currScore;
          curr.data.scoreTracker.addAverage(currScore);
        } else {
          // else
          // subtract that number from our score tracker
          // curr.data.scoreTracker.rollingAverageScore - +currScore;
          curr.data.scoreTracker.addAverage(-currScore);
        }

        //Populate our children with our current score tracker
        possibleNextBoards.forEach((item) => {
          item.scoreTracker = curr.data.scoreTracker;
        });
      }

      cnt++;
    }

    this.rootScoresList.sort(
      (a, b) => a.rollingAverageScore - b.rollingAverageScore
    );

    console.log(this.rootScoresList);

    return this.rootScoresList[this.rootScoresList.length - 1].move;
  }

  makeMove(col: number, color: number): Board {
    if (color !== 1 && color !== 2) {
      return undefined;
    }
    if (col < 0 || col > this.arr[0].length) {
      return undefined;
    }

    //copy board to new array
    const ret = [];
    for (let i = 0; i < this.arr.length; i++) {
      // Potential slowdown
      ret.push([...this.arr[i]]);
    }

    //make move in array
    for (let row = this.height - 1; row >= 0; row--) {
      if (ret[row][col] === 0) {
        ret[row][col] = color;
        break;
      }
    }

    //construct new board and return it
    const b = new Board(ret);
    b.moveList = [
      ...this.moveList,
      {
        color: color,
        colulmn: col,
      },
    ];
    return b;
  }

  printBoard() {
    console.table(this.arr);
    console.log('Score', this.score);
  }
}

export default Board;
