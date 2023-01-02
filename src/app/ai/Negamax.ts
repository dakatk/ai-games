// Game logic
import GameLogic, { Player, opposing } from '../game/logic/GameLogic';

// AI logic base
import Ai, { GameEnd } from './Ai';

interface MoveValue<TMove> {
    move: TMove;
    value: number;
}

/**
 * Negamax (streamlined Minimax algorithm)
 */
export default class Negamax<TMove extends object> implements Ai<TMove> {
    private bestMoves: Array<MoveValue<TMove>> = [];

    constructor(private maxDepth: number, private maxScore: number = 1000) {}

    bestMove(game: GameLogic<TMove>): TMove | null {
        this.bestMoves = [];
        this.negamax(game, 0, -this.maxScore, this.maxScore, Player.CPU);

        if (this.bestMoves.length === 0) {
            return null;
        }

        const bestMove: MoveValue<TMove> = this.bestMoves.reduce((a: MoveValue<TMove>, b: MoveValue<TMove>) => (
            a.value > b.value ? a : b
        ));

        return bestMove.move;
    }

    /**
     * Negamax search with alpha-beta pruning
     * 
     * @param game Game
     * @param depth Current deph of search
     * @param alpha Alpha value (left-bound)
     * @param beta Beta value (right bound)
     * @param player Current player
     */
    private negamax(game: GameLogic<TMove>, depth: number, alpha: number, beta: number, player: Player): number {
        if (depth > this.maxDepth || game.isOver()) {
            return player * game.score(player, depth);
        }

        let value = -this.maxScore;

        for (const move of game.allowedMoves(player)) {
            game.move(player, move, true);

            const nextPlayer: Player = opposing(player);
            let negamaxValue: number;

            if (game.canWin(nextPlayer)) {
                negamaxValue = -this.maxScore;
            } else {
                negamaxValue = -this.negamax(game, depth + 1, -beta, -alpha, nextPlayer);
            }

            value = Math.max(value, negamaxValue);
            game.undoMove();

            if (depth === 0) {
                this.bestMoves.push({ move, value });
            }

            alpha = Math.max(alpha, negamaxValue);
            
            if (alpha >= beta) {
                return alpha;
            }
        }
        return value;
    }
    
    update(_: GameEnd): void {}
}