// Game logic
import GameLogic from "../game/logic/GameLogic";

// AI logic base
import Ai, { GameEnd } from "./Ai";

/**
 * Negamax (streamlined Minimax algorithm)
 */
export default class Negamax<TMove extends object> implements Ai<TMove> {
    bestMove(game: GameLogic<TMove>, _: (moveSer: string) => TMove): TMove | null {
        throw new Error("Method not implemented.");
    }
    
    update(gameEnd: GameEnd): void {}
}