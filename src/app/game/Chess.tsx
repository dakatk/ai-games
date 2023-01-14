// Basic React stuff
import React from 'react';

// MUI components
import Grid from '@mui/material/Grid';

// Parent component
import GameComponent, { GameProps } from './GameComponent';

// Game logic
import ChessLogic from './logic/Chess';
// import { Player } from './logic/GameLogic';

// Chess library
import { Move } from '../../lib/chess';

// Chess piece images
import WhitePawn from '../../resources/white_pawn.png';
import WhiteRook from '../../resources/white_rook.png';
import WhiteKnight from '../../resources/white_knight.png';
import WhiteBishop from '../../resources/white_bishop.png';
import WhiteQueen from '../../resources/white_queen.png';
import WhiteKing from '../../resources/white_king.png';
import BlackPawn from '../../resources/black_pawn.png';
import BlackRook from '../../resources/black_rook.png';
import BlackKnight from '../../resources/black_knight.png';
import BlackBishop from '../../resources/black_bishop.png';
import BlackQueen from '../../resources/black_queen.png';
import BlackKing from '../../resources/black_king.png';

// Stylesheet
import './Chess.scss'

// Image source paths for pieces by color and type
const imageSrcForPiece: Record<string, Record<string, string>> = {
    'w': {
        'p': WhitePawn,
        'r': WhiteRook,
        'n': WhiteKnight,
        'b': WhiteBishop,
        'q': WhiteQueen,
        'k': WhiteKing
    },
    'b': {
        'p': BlackPawn,
        'r': BlackRook,
        'n': BlackKnight,
        'b': BlackBishop,
        'q': BlackQueen,
        'k': BlackKing
    }
}

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

    // ====================== Event handlers =============================

    // TODO Overridw `onMove` for chess rules

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
    private renderRow(row: Array<any>, rowIndex: number): JSX.Element {
        return (
            <Grid 
                container
                justifyContent='center'
                alignItems='center'
            >
                {row.map((cell, j) => this.renderCell(cell, rowIndex, j))}
            </Grid>
        );
    }

    /**
     * Render cell at (`rowIndex`, `colIndex`)
     */
    private renderCell(cell: any | null, rowIndex: number, colIndex: number): JSX.Element {
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
                {this.renderPiece(cell)}
            </Grid>
        );
    }

    /**
     * Render piece at (`row`, `col`)
     */
    private renderPiece(cell: any | null): JSX.Element | undefined {
        // Empty cell (no piece to render)
        if (cell === null) {
            return undefined;
        }

        // Find corresponding PNG for piece color and type
        const imageSrc: string | undefined = imageSrcForPiece[cell.color][cell.type];

        // If no image source found, skip rendering
        if (imageSrc === undefined) {
            return undefined;
        }

        // Render piece's corresponding PNG image
        return <img src={imageSrc} alt={`${cell.color}${cell.type}`} />
    }

    // ===================================================================
}