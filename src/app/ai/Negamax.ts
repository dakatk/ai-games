// Game logic
import GameLogic, { Player, opposing } from '../game/logic/GameLogic';

// AI logic base
import Ai, { GameEnd } from './Ai';

interface MoveValue<TMove> {
    move: TMove;
    value: number;
}

interface TranspositionTable<TMove> {
    [gameState: string]: Array<MoveValue<TMove>>;
}

/**
 * Negamax (streamlined Minimax algorithm)
 */
export default class Negamax<TMove> implements Ai<TMove> {
    private bestMoves: Array<MoveValue<TMove>> = [];
    private table: TranspositionTable<TMove> = {};

    constructor(private maxDepth: number, private maxScore: number = 1000) {}

    bestMove(game: GameLogic<TMove>): TMove | null {
        const gameState: string = game.repr;

        if (gameState in this.table) {
            // If the current gaem state has been visited before, 
            // no more work needs to be done
            this.bestMoves = this.table[gameState];
        } else {
            // ... otherwise, use Negamax search tree to record move-score pairs
            this.bestMoves = [];
            this.negamax(game, 0, -this.maxScore, this.maxScore, Player.CPU);
            this.table[gameState] = this.bestMoves;
        }

        // If no moves found, return null (AI will forfeit
        if (this.bestMoves.length === 0) {
            return null;
        }

        // Find best move from candidates produced by the 
        // Negamax search tree based on score
        const bestMove: MoveValue<TMove> = this.bestMoves.reduce((a: MoveValue<TMove>, b: MoveValue<TMove>) => (
            b.value > a.value ? b : a
        ));

        return bestMove.move;
    }

    /**
     * Negamax search with alpha-beta pruning
     * 
     * @param game Game
     * @param depth Current depth of search
     * @param alpha Alpha value (left-bound)
     * @param beta Beta value (right bound)
     * @param player Current player
     */
    private negamax(game: GameLogic<TMove>, depth: number, alpha: number, beta: number, player: Player): number {
        // Terminating case (reached max depth or a node with no children)
        if (depth > this.maxDepth || game.isOver()) {
            return player * game.score(player, depth);
        }

        // Value starts at worst-case scenario
        let value = -this.maxScore;

        for (const move of game.allowedMoves(player)) {
            // Make move and save it in the game's move history
            game.move(player, move, true);

            const nextPlayer: Player = opposing(player);
            let negamaxValue: number;

            if (game.canWin(nextPlayer)) {
                // Don't investigate moves that allow the 
                // opposing player to win on the next turn
                negamaxValue = -this.maxScore;
            } else {
                negamaxValue = -this.negamax(game, depth + 1, -beta, -alpha, nextPlayer);
            }

            value = Math.max(value, negamaxValue);
            // Undo move (resets game state to where it was before the `negamax` call)
            game.undoMove();

            if (depth === 0) {
                this.bestMoves.push({ move, value });
            }

            // Naming here is misleading. Since `alpha` and `beta` swap for 
            // each recursive call, this effectively becomes `beta = -Math.max(-beta, -negamaxValue)`
            // for calls at odd-numbered depths
            alpha = Math.max(alpha, negamaxValue);
            
            // Cutoff case (prune by alpha or beta, depending on value of `player`)
            if (alpha >= beta) {
                return alpha;
            }
        }
        return value;
    }
    
    update(_: GameEnd) {}
}