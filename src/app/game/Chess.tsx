// Basic React stuff
import React from 'react';

// MUI components
import Grid from '@mui/material/Grid';

// Parent component
import GameComponent, { GameProps } from './GameComponent';

// Game logic
import ChessLogic from './logic/Chess';
import { Player } from './logic/GameLogic';

// Chess library
import { Move } from '../../lib/chess';

// Stylesheet
import './Chess.scss'

// Alternte between light and dark
// (mod 2 representation)
const cellClassNames: Array<string> = [
    'chess-piece-light', 
    'chess-piece-dark', 
    'chess-piece-light'
];

/**
 * Chess game w/ AI
 */
export default class Chess extends GameComponent<Move | string> {

    // ====================== Initialization =============================

    constructor(props: GameProps) {
        super(props, new ChessLogic());
    }

    // ====================== Component rendering ========================

    renderChild() {
        return this.renderBoard();
    }

    /**
     * Render entire Tic-Tac-Toe board
     */
    private renderBoard(): JSX.Element {
        return (
            <Grid container>
                {this.state.board?.map((row, i) => (
                    <Grid key={i} item xs={12} className='board'>
                        {this.renderRow(row, i)}
                    </Grid>
                ))}
            </Grid>
        );
    }

    /**
     * Render single row of board at `rowIndex`
     */
    private renderRow(row: Array<number>, rowIndex: number): JSX.Element {
        return (
            <Grid 
                container
                justifyContent='center'
                alignItems='center'
            >
                {row.map((_, j) => this.renderCell(rowIndex, j))}
            </Grid>
        );
    }

    /**
     * Render cell at (`rowIndex`, `colIndex`)
     */
    private renderCell(rowIndex: number, colIndex: number): JSX.Element {
        // Even squares are dark, odd squares are light
        const cellIndexMod: number = (rowIndex % 2) + (colIndex % 2);
        const className: string = `chess-cell ${cellClassNames[cellIndexMod]}`;
        // Disable `onClick` event by default
        let onClick: React.MouseEventHandler<HTMLDivElement> | undefined = undefined;

        return (
            <Grid item
                key={colIndex}
                className={className}
                onClick={onClick}
            >
            </Grid>
        );
    }

    /**
     * Render piece for cell (`row`, `col`)
     */
    // private renderPiece(row: number, col: number): JSX.Element | undefined {
    //     if (this.state.board === undefined) {
    //         return undefined;
    //     }
        
    //     const pieceValue = this.state.board[row][col];

    //     switch (pieceValue) {
    //         case Player.HUMAN:
    //             return <ClearIcon className='piece' />;

    //         case Player.CPU:
    //             return <PanoramaFishEyeIcon className='piece' />;

    //         default:
    //             return undefined;
    //     }
    // }

    // ===================================================================
}