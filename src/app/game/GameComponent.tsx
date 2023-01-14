// Basic React stuff
import React, { ErrorInfo } from 'react';

// Async component base class
import AsyncComponent from '../AsyncComponent';

// MUI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// App context
import { AppContext, AppContextData } from '../AppContext';

// Game logic
import GameLogic, { Player } from './logic/GameLogic';

// AI stuff
import Ai, { GameEnd } from '../ai/Ai';
import AiType from '../ai/AiType';

// AI implementations
import Menace from '../ai/Menace';
import Negamax from '../ai/Negamax';

// Stylesheet
import './GameComponent.scss';

/**
 * Game component props
 */
export interface GameProps {
    /**
     * Default search depth (not applicable to all AI variants)
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
export default class GameComponent<TMove> extends AsyncComponent<GameProps, GameState> {
    /**
     * React context type
     */
    static contextType: React.Context<AppContextData> = AppContext;

    // TODO Fix typescript declare support in webpack
    /**
     * Override type for React context
     */
    // declare context: AppContextData;

    /**
     * AI logic
     */
    protected ai: Ai<TMove> = new Negamax<TMove>(DEFAULT_SEARCH_DEPTH);

    private prevContext: AppContextData | undefined;

    // ====================== Initialization =============================

    constructor(props: GameProps, protected gameLogic: GameLogic<TMove>) {
        super(props);

        this.state = {
            gameover: false,
            board: this.gameLogic.board,
            depth: this.props.searchDepth || DEFAULT_SEARCH_DEPTH
        };
    }

    // ====================== Event handlers =============================

    /**
     * Event handler for when the human 
     * player makes a play using UI
     * 
     * @param move Move made by human player
     */
    protected async onMove(move: TMove): Promise<void> {
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

    // ====================== React callback overrides ===================

    componentDidMount() {
        this.updateAiFromContext();
    }

    componentDidUpdate() {
        this.updateAiFromContext();
    }

    /**
     * Update AI from value passed in through app context
     */
    private updateAiFromContext() {
        if (!this.context || !this.contextIsDirty()) {
            return;
        }

        let context = this.context as AppContextData;

        switch (context.aiType) {
            case AiType.NEGAMAX:
                // Default search depth value comes from props
                const searchDepth: number = context.searchDepth || this.props.searchDepth;
                this.ai = new Negamax(searchDepth, context.maxScore);
                break;

            case AiType.MENACE:
                this.ai = new Menace(context.defaultBeads);
        }

        this.gameLogic.reset();
        this.setState({ 
            gameover: false,
            winMessage: undefined,
            board: this.gameLogic.board
         });
    }

    private contextIsDirty(): boolean {
        if (this.prevContext !== this.context) {
            this.prevContext = this.context as AppContextData;
            return true;
        }
        return false;
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    // ====================== Component rendering ========================

    // FIXME Bottom margin/padding is off, probably a flex issue
    render() {
        return (
            <div style={{ maxWidth: '41em', maxHeight: '45em', border: '2px solid black', paddingBottom: '1.5em' }}>
                <Grid
                    container
                    spacing={0}
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                    style={{ minHeight: '36em', maxHeight: '40em' }}
                >
                    {this.renderGame()}
                </Grid>
            </div>
        );
    }
    
    /**
     * Render callback for child class (must be overriden)
     */
    renderChild(): JSX.Element {
        throw new Error('Method `renderChild` not implemented')
    }

    /**
     * Renders all components needed for gameplay
     */
    private renderGame(): JSX.Element | JSX.Element[] {
        if (this.state.error) {
            return this.renderErrorMessage();
        } else {
            return [
                this.renderWinMessage(),
                <Box key={2}>{this.renderChild()}</Box>,
                <Box key={3} className='game-padding'></Box>
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
        return <Box key={1} className='win-message'>{this.state.winMessage}</Box>
    }

    // ===================================================================
}