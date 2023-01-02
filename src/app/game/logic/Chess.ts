// Game logic base
import GameLogic, { opposing, Player } from './GameLogic';

// Chess library
import { 
    Chess,
    Move,
    Square,
    PieceSymbol,
    Color
} from '../../../lib/chess';

/**
 * Chess piece data
 */
export type Piece = {
    square: Square,
    type: PieceSymbol,
    color: Color,
};

/**
 * Game logic for Chess
 */
export default class ChessLogic implements GameLogic<string | Move> {
    private static playerColor: Record<Player, Color> = {
        [Player.HUMAN]: 'w',
        [Player.CPU]: 'b'
    };

    private _chess: Chess = new Chess();

    get board(): Array<Array<Piece | null>> {
        return this._chess.board();
    }

    get repr(): string {
        return this._chess.fen();
    }

    private set turn(player: Player) {
        this._chess.turn = ChessLogic.playerColor[player];
    }

    allowedMoves(player: Player): Array<string | Move> {
        this.turn = player;
        return this._chess.moves();
    }

    move(player: Player, movePos: string) {
        this.turn = player;
        this._chess.move(movePos, { sloppy: true });
    }

    canWin(player: Player): boolean {
        this.turn = player;

        if (this._chess.inCheck()) {
            return false;
        }
        // TODO
        throw new Error('Method not implemented.');
    }

    undoMove() {
        this._chess.undo();
    }

    score(player: Player): number {
        // TODO
        throw new Error('Method not implemented.');
    }

    isOver(): boolean {
        return this._chess.isGameOver()
    }

    isWinner(player: Player): boolean {
        this.turn = opposing(player);
        return this._chess.isCheckmate();
    }

    reset() {
        this._chess.reset();
    }
}