// Game logic
import Logic, { Player } from '../game/logic/GameLogic';

// AI logic base
import Ai, { GameEnd } from './Ai';

interface MatchboxCollection<TMove> {
    [state: string] : Array<MatchboxState<TMove>>
}

interface MatchboxState<TMove> {
    move: TMove;
    beads: number;
};

type Matchbox<TMove> = Array<MatchboxState<TMove>>;

/**
 * Matchbox Educable Naughts and Crosses Engine
 */
export default class Menace<TMove extends object> implements Ai<TMove> {
    private matchboxes: MatchboxCollection<TMove> = {};
    private history: Array<MatchboxState<TMove>> = [];

    constructor(private defaultBeads: number = 3) {}

    bestMove(game: Logic<TMove>): TMove | null {
        const gameState: string = game.repr;

        if (!(gameState in this.matchboxes)) {
            const allowedMoves: Array<TMove> = game.allowedMoves(Player.CPU);
            const newMatchbox: Matchbox<TMove> = allowedMoves.map((move: TMove) => (
                { move, beads: this.defaultBeads }
            ));
            
            this.matchboxes[gameState] = newMatchbox;
        }

        const currentMatchbox: Matchbox<TMove> = this.matchboxes[gameState];

        if (currentMatchbox.length === 0) {
            return null;
        }

        const randomState: MatchboxState<TMove> = this.weightedRandom(currentMatchbox);
        this.history.unshift(randomState);

        return randomState.move;
    }

    /**
     * 
     * @param options 
     * @returns 
     */
    private weightedRandom(options: Array<MatchboxState<TMove>>): MatchboxState<TMove> {
        const weights: Array<number> = [];
        let i;

        for (i = 0; i < options.length; i++) {
            weights[i] = options[i].beads + (weights[i - 1] || 0);
        }
        
        var random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
                break;
            }
        }
        return options[i];
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

        for (const move of this.history) {
            move.beads += beadsDelta;
        }
    }
}