import GameLogic from "../game/logic/GameLogic";

export enum GameEnd {
    WIN, LOSE, DRAW
}

/**
 * AI logic base
 */
export default interface Ai<TMove> {
    /**
     * Get best move for current game state
     * 
     * @param game Game logic
     */
    bestMove(game: GameLogic<TMove>, deser: (moveSer: string) => TMove): TMove | null;

    /**
     * Updates AI's internal parameters (if applicable)
     * 
     * @param gameEnd Type of game ending from AI's perspective
     */
    update(gameEnd: GameEnd): void;
}