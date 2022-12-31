import React from 'react';

import queryString, { ParsedQuery } from 'query-string';

import GameLogic, { Player } from './logic/GameLogic';
import Ai, { GameEnd } from '../ai/Ai';
import Menace from '../ai/Menace';
import Negamax from '../ai/Negamax';

enum AiType {
    NEGAMAX = 'negamax',
    MENACE = 'menace'
}

interface GameState {
    board: Array<Array<any>>;
    gameover: boolean;
    winMessage: string | null;
}

/**
 * Base component for games
 */
export default class GameComponent<TMove extends object> extends React.Component<any, GameState> {
    protected ai: Ai<TMove>;

    constructor(props: any, protected gameLogic: GameLogic<TMove>) {
        super(props);

        this.ai = this.parseQueryParams();
        this.state = {
            gameover: false,
            winMessage: null,
            board: this.gameLogic.board
        }
    }

    private parseQueryParams(): Ai<TMove> {
        const queryParams: ParsedQuery<string> = queryString.parse(window.location.search);
        const aiParam: string | null = queryParams.ai as (string | null);

        let aiName: string = aiParam?.toLowerCase() || AiType.MENACE;
        if (!(aiName in AiType)) {
            aiName = AiType.MENACE
        }
        
        const aiType: AiType = AiType[aiName as keyof typeof AiType];

        switch (aiType) {
            case AiType.MENACE:
                return new Menace<TMove>();

            case AiType.NEGAMAX:
                return new Negamax();
        }
    }

    protected async onMove(move: TMove): Promise<void> {
        if (this.state.gameover) {
            return;
        }

        this.gameLogic.move(Player.HUMAN, move);
        await this.update();

        if (this.gameLogic.isWinner(Player.HUMAN)) {

            await this.setStateAsync({ gameover: true, winMessage: 'You win!' });
            this.ai.update(GameEnd.LOSE);

            return;

        } else if (this.gameLogic.isOver()) {

            await this.setStateAsync({ gameover: true, winMessage: 'Tie game' });
            this.ai.update(GameEnd.DRAW);

            return;
        }

        const aiMove: TMove | null = this.ai.bestMove(this.gameLogic, this.deserMove);

        if (aiMove === null) {
            await this.setStateAsync({ gameover: true, winMessage: 'AI forfeits!' });
            this.ai.update(GameEnd.DRAW);

            return;
        }

        this.gameLogic.move(Player.CPU, aiMove as TMove, true);
        await this.update();

        if (this.gameLogic.isWinner(Player.CPU)) {
            
            await this.setStateAsync({ gameover: true, winMessage: 'AI wins'});
            this.ai.update(GameEnd.WIN);

        } else if (this.gameLogic.isOver()) {

            await this.setStateAsync({ gameover: true, winMessage: 'Tie game' });
            this.ai.update(GameEnd.DRAW);
        }
    }

    protected deserMove(moveSer: string): TMove {
        throw new Error('Deser called from parent (not implemented)');
    }

    protected async update() {
        await this.setStateAsync({ board: this.gameLogic.board });
    }

    protected async setStateAsync(newState: any) {
        return new Promise((resolve) => (
            this.setState(newState, () => resolve(null))
        ));
    }
}