// Basic React stuff
import React, { ErrorInfo } from 'react';

// MUI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Query string parser
import queryString, { ParsedQuery } from 'query-string';

// Game logic
import GameLogic, { Player } from './logic/GameLogic';

// AI logic base
import Ai, { GameEnd } from '../ai/Ai';

// AI implementations
import Menace from '../ai/Menace';
import Negamax from '../ai/Negamax';

enum AiType {
    NEGAMAX = 'negamax',
    MENACE = 'menace'
}

/**
 * Game component props
 */
export interface GameProps {
    /**
     * Initial value for search depth parameter
     */
    searchDepth: number;
}

/**
 * Game component state
 */
export interface GameState {
    /**
     * Game over 
     */
    gameover?: boolean;
    /**
     * Optional message for end of game
     */
    winMessage?: string;
    /**
     * Game board representation (for rendering purposes)
     */
    board?: Array<Array<any>>;
    /**
     * Search depth parameter
     */
    depth?: number;
    /**
     * Error caught in component rendering
     */
    error?: Error;
    /**
     * Error info
     */
    errorInfo?: ErrorInfo;
}

const DEFAULT_SEARCH_DEPTH: number = 2;

/**
 * Base component for games
 */
export default class GameComponent<TMove> extends React.Component<GameProps, GameState> {
    /**
     * AI logic
     */
    protected ai: Ai<TMove>;

    constructor(props: GameProps, protected gameLogic: GameLogic<TMove>) {
        super(props);

        this.state = {
            gameover: false,
            board: this.gameLogic.board,
            depth: this.props.searchDepth || DEFAULT_SEARCH_DEPTH
        };
        this.ai = this.parseQueryParams();
    }

    private parseQueryParams(): Ai<TMove> {
        const queryParams: ParsedQuery<string> = queryString.parse(window.location.search);
        const aiParam: string | null = queryParams.ai as (string | null);

        let aiName: string = aiParam?.toUpperCase() || AiType.MENACE;

        if (!(aiName in AiType)) {
            aiName = AiType.MENACE
        }
        
        const aiType: AiType = AiType[aiName as keyof typeof AiType];

        switch (aiType) {
            case AiType.MENACE:
                return new Menace<TMove>();

            case AiType.NEGAMAX:
                return new Negamax(this.state.depth || DEFAULT_SEARCH_DEPTH);
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    /**
     * Event handler for when the human 
     * player makes a play using UI
     * 
     * @param move Move made by human player
     */
    protected async onMove(move: TMove): Promise<void> {
        console.log(this.state);
        // Can't make moves for a finished game
        if (this.state.gameover) {
            return;
        }

        // Update game logic and UI with human player's move
        this.gameLogic.move(Player.HUMAN, move);
        await this.update();

        if (this.gameLogic.isWinner(Player.HUMAN)) {
            // Set state and update when human player has won
            await this.setStateAsync({ gameover: true, winMessage: 'You win!' });
            this.ai.update(GameEnd.LOSE);

            return;

        } else if (this.gameLogic.isOver()) {
            // Set state and update on tie game after human has played
            await this.setStateAsync({ gameover: true, winMessage: 'Tie game' });
            this.ai.update(GameEnd.DRAW);

            return;
        }

        // AI gets best move using logic and stuff
        const aiMove: TMove | null = this.ai.bestMove(this.gameLogic);

        // If the AI can't find a move, it forfeits the game
        if (aiMove === null) {
            // Set state and update when AI forfeits
            await this.setStateAsync({ gameover: true, winMessage: 'AI forfeits!' });
            this.ai.update(GameEnd.DRAW);

            return;
        }

        // Update game logic and UI with AI's move
        this.gameLogic.move(Player.CPU, aiMove as TMove, true);
        await this.update();

        if (this.gameLogic.isWinner(Player.CPU)) {
            // Set state and update on tie game after AI has played
            await this.setStateAsync({ gameover: true, winMessage: 'AI wins'});
            this.ai.update(GameEnd.WIN);

        } else if (this.gameLogic.isOver()) {
            // Set state and update when AI wins
            await this.setStateAsync({ gameover: true, winMessage: 'Tie game' });
            this.ai.update(GameEnd.DRAW);
        }
    }

    /**
     * Update game board in component state
     */
    protected async update() {
        await this.setStateAsync({ board: this.gameLogic.board });
    }

    /**
     * Call React `setState` in async context
     * 
     * @param newState Updated component state
     */
    protected async setStateAsync(newState: GameState) {
        return new Promise((resolve) => (
            this.setState(newState, () => resolve(null))
        ));
    }

    render() {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                {this.renderGame()}
            </Grid>
        );
    }

    private renderGame(): JSX.Element | JSX.Element[] {
        if (this.state.error) {
            return this.renderErrorMessage();
        } else {
            return [
                this.renderWinMessage(),
                <div key={2}>{this.renderChild()}</div>,
                this.renderResetButton()
            ];
        }
    }

    /**
     * Error message caught during component rendering
     */
    private renderErrorMessage(): JSX.Element {
        return <Box>{this.state.error?.toString()}</Box>
    }

    /**
     * Message shown after game has ended
     */
    private renderWinMessage(): JSX.Element {
        return <Box key={1}>{this.state.winMessage}</Box>
    }

    /**
     * Button that resets the game to its initial state
     */
    private renderResetButton(): JSX.Element {
        return (
            <button key={3} onClick={async () => {
                this.gameLogic.reset();
                await this.setStateAsync({ winMessage: undefined, gameover: false });
                await this.update();
            }}>Reset</button>
        )
    }

    /**
     * Render callback for child class (must be overriden)
     */
    renderChild(): JSX.Element {
        throw new Error('Method `renderChild` not implemented')
    }
}