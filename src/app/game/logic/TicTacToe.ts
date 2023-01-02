// Game logic base
import GameLogic, { Player } from './GameLogic';

// Type alias for moves
export type Move = [number, number];

/**
 * Game logic for Tic-Tac-Toe (Naughts and Crosses)
 */
export default class TicTacToeLogic implements GameLogic<Move> {
    private static winChecks: Array<Array<Move>> = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Cols
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diags
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    private _boardArray: Array<Array<number>> = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    private _movesQueue: Array<Move> = [];

    get board(): Array<Array<number>> {
        return this._boardArray
    }

    get repr(): string {
        return this._boardArray.map((row) => (
            row.map((col) => {
                switch (col) {
                    case Player.HUMAN:
                        return 'X';
                    case Player.CPU:
                        return 'O';
                    default: 
                        return '';
                }    
            }).join('')
        )).join('');
    }

    allowedMoves(_: Player): Array<Move> {
        const moves: Array<Move> = [];

        for (let i = 0; i < this._boardArray.length; i ++) {
            const row = this._boardArray[i];

            for (let j = 0; j < row.length; j ++) {
                if (row[j] === 0) {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    }

    move(player: Player, movePos: Move, enqueue?: boolean | undefined) {
        if (enqueue) {
            this._movesQueue.unshift(movePos);
        }
        const row: number = movePos[0];
        const col: number = movePos[1];

        this._boardArray[row][col] = player;
    }

    canWin(player: Player): boolean {
        for (let i = 0; i < this._boardArray.length; i ++) {
            const row = this._boardArray[i];

            for (let j = 0; j < row.length; j ++) {
                if (row[j] !== 0) {
                    continue;
                }

                row[j] = player;
                const winner: boolean = this.isWinner(player);
                row[j] = 0;

                if (winner) {
                    return true;
                }
            }
        }
        return false;
    }

    undoMove() {
        if (this._movesQueue.length === 0) {
            return;
        }

        const move: Move = this._movesQueue.shift() as Move;
        const row: number = move[0];
        const col: number = move[1];

        this._boardArray[row][col] = 0;
    }

    score(player: Player, depth?: number | undefined): number {
        if (this.isWinner(player)) {
            return 1000 / (depth || 1);
        } else if (this.numMovesLeft() === 0) {
            return 0;
        } else {
            return -1000 / (depth || 1);
        }
    }

    isOver(): boolean {
        return this.isWinner(Player.HUMAN) || this.isWinner(Player.CPU) || (this.numMovesLeft() === 0);
    }

    private numMovesLeft(): number {
        let numMoves = 0;

        for (let i = 0; i < this._boardArray.length; i ++) {
            const row = this._boardArray[i];

            for (let j = 0; j < row.length; j ++) {
                if (row[j] === 0) {
                    numMoves ++;
                }
            }
        }
        return numMoves
    }

    isWinner(player: Player): boolean {
        const magicNumber: number = player * 3;

        for (const winCheck of TicTacToeLogic.winChecks) {
            const winSum: number = winCheck.reduce((accum: number, move: Move) => (
                accum + this.pieceAt(move)
            ), 0);

            if (winSum === magicNumber) {
                return true;
            }
        }
        return false;
    }

    private pieceAt(move: Move): number {
        const row: number = move[0];
        const col: number = move[1];

        return this.board[row][col];
    }

    reset() {
        this._boardArray = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    }
}