/**
 * Labels and scores for both types of player
 */
export enum Player {
    /**
     * Human player (negative score from AI's perspective)
     */
    HUMAN = -1,

    /**
     * AI player (positive score from AI's perspective)
     */
    CPU = 1
}

const _opposingPlayer: Record<Player, Player> = {
    [Player.HUMAN]: Player.CPU,
    [Player.CPU]: Player.HUMAN
}

/**
 * @param player Human or AI
 * @returns Opposing player to `player`
 */
export function opposing(player: Player): Player {
    return _opposingPlayer[player];
}

/**
 * Base for game logic
 */
export default interface GameLogic<TMove> {
    /**
     * Representation of game board as nested array
     */
    get board(): Array<Array<any>>;

    /**
     * Representation of gameboard as flattened string
     */
    get repr(): string;

    /**
     * Get all allowed moves for `player`
     * 
     * @param player Human or AI
     */
    allowedMoves(player: Player): Array<TMove>;

    /**
     * Makes move for `player` at position `movePos`
     * (assumes move at `movePos` is allowed)
     * 
     * @param player Human or AI
     * @param movePos Move position on board
     * @param enqueue Add move to move history queue (allows undo)
     */
    move(player: Player, movePos: TMove, enqueue?: boolean | undefined): void;

    /**
     * Checks if `player` is able to win in one move 
     * with the current board state
     * 
     * @param player Human or AI
     */
    canWin(player: Player): boolean;

    /**
     * Takes back most recent move in queue
     */
    undoMove(): void;

    /**
     * Score for `player` at search depth `depth` for current game state
     * 
     * @param player Human or AI
     * @param depth Current search depth
     */
    score(player: Player, depth?: number | undefined): number;

    /**
     * Checks if game is at a terminal state
     */
    isOver(): boolean;

    /**
     * Checks if `player` has won
     * 
     * @param player Human or AI
     */
    isWinner(player: Player): boolean;

    /**
     * Resets game to initial state
     */
    reset(): void;
}