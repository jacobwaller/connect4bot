import Board from './board';

class Tree {
  data: Board;
  children: Array<Tree>;

  constructor(data: any) {
    this.data = data;
    this.children = [];
  }

  addChild(data: Board) {
    const node: Tree = {
      addChild: this.addChild,
      data: data,
      children: [],
      minimax: this.minimax,
      print: this.print,
    };

    this.children.push(node);
    return node;
  }

  /**
   * Provided a color (1,2), should run minimax on tree
   * to determine the best numerical move (0-6) for that color
   * @param color
   */
  minimax(color: number): number {
    // - minimax on children

    return 0;
  }

  print() {
    console.log(this.data.printBoard());
    this.children.forEach((item) => {
      item.print();
    });
  }
}

export default Tree;
