import Board from './board';

// import Board from './board';

export default (arg: string, width: number, height: number): Board => {
  console.log('inside');

  const ret = [];

  for (let i = 0; i < height; i++) {
    const strToArr = arg.slice(i * width, i * width + height + 1).split('');
    ret.push(
      strToArr.map((item) => {
        switch (item) {
          case '0':
            return 0;
          case 'r':
            return 1;
          case 'b':
            return 2;
          default:
            return 0;
        }
      })
    );
  }

  const arr = ret.reverse();
  return new Board(arr);
};
