// Game logic
import Logic, { Player } from '../game/logic/GameLogic';

// AI logic base
import Ai, { GameEnd } from './Ai';

interface MatchboxCollection {
    [state: string] : Matchbox
}

type Matchbox = {
    [move: string]: number;
};

/**
 * Matchbox Educable Naughts and Crosses Engine
 */
export default class Menace<TMove extends object> implements Ai<TMove> {
    private matchboxes: MatchboxCollection = {};
    private history: Array<[string, string]> = [];

    constructor(private defaultBeads: number = 3) {}

    bestMove(game: Logic<TMove>, deser: (moveSer: string) => TMove): TMove | null {
        const gameState: string = game.repr;

        if (!(gameState in this.matchboxes)) {
            const newMatchbox: Matchbox = {};
            const allowedMoves: Array<TMove> = game.allowedMoves(Player.CPU);
            
            for (const move of allowedMoves) {
                newMatchbox[move.toString()] = this.defaultBeads;
            }
        }

        const currentMatchbox: Matchbox = this.matchboxes[gameState];

        if (Object.keys(currentMatchbox).length === 0) {
            return null;
        }

        const bestMove: [string, number] = Object.entries(currentMatchbox)
            .reduce((a: [string, number], b: [string, number]) => (
                a[1] > b[1] ? a : b
            ));
        
        this.history.unshift([gameState, bestMove[0]]);
        return deser(bestMove[0]);
    }
    
    update(gameEnd: GameEnd): void {
        let beadsDelta: number = 0;
        switch (gameEnd) {
            case GameEnd.WIN:
                beadsDelta = 3;
                break;

            case GameEnd.DRAW:
                beadsDelta = 1;
                break;

            case GameEnd.LOSE:
                beadsDelta = -1;
                break;
        }

        for (const [gameState, bestMove] of this.history) {
            this.matchboxes[gameState][bestMove] += beadsDelta;
        }
    }
}