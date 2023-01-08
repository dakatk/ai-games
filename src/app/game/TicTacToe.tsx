// Basic React stuff
import React from 'react';

// MUI components
import Grid from '@mui/material/Grid';
import ClearIcon from '@mui/icons-material/Clear';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

// Parent component
import GameComponent, { GameProps } from './GameComponent';

// Game logic
import TicTacToeLogic, { Move } from './logic/TicTacToe';
import { Player } from './logic/GameLogic';

// Stylesheet
import './TicTacToe.scss';

/**
 * Tic-Tac-Toe (Naughts and Crosses) game w/ AI
 */
export default class TicTacToe extends GameComponent<Move> {

    // ====================== Initialization =============================

    constructor(props: GameProps) {
        super(props, new TicTacToeLogic())
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
            <Grid container justifyContent='center' alignItems='center'>
                {row.map((_, j) => this.renderCell(rowIndex, j))}
            </Grid>
        );
    }

    /**
     * Render cell at (`rowIndex`, `colIndex`)
     */
    private renderCell(rowIndex: number, colIndex: number): JSX.Element {
        // Middle column has vertical borders
        let className: string = (colIndex === 1) ? 'cell vert' : 'cell';
        // Disable `onClick` event by default
        let onClick: React.MouseEventHandler<HTMLDivElement> | undefined = undefined;

        // Middle row has horizontal and vertical borders
        if (rowIndex === 1) {
            className += ' horiz';
        }

        if (this.state.board !== undefined) {
            const pieceValue = this.state.board[rowIndex][colIndex];

            if (pieceValue === 0) {
                // If space is empty, enable `onClick` event
                onClick = async () => await this.onMove([rowIndex, colIndex]);
            } else {
                // Otherwise, mark space as 'occupied'
                className += ' occupied';
            }
        }

        return (
            <Grid item
                key={colIndex}
                className={className}
                onClick={onClick}
            >
                {this.renderPiece(rowIndex, colIndex)}
            </Grid>
        );
    }

    /**
     * Render piece for cell (`row`, `col`)
     */
    private renderPiece(row: number, col: number): JSX.Element | undefined {
        if (this.state.board === undefined) {
            return undefined;
        }
        
        const pieceValue = this.state.board[row][col];

        switch (pieceValue) {
            case Player.HUMAN:
                return <ClearIcon className='piece' />;

            case Player.CPU:
                return <PanoramaFishEyeIcon className='piece' />;

            default:
                return undefined;
        }
    }

    // ===================================================================
}