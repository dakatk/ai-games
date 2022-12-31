// MUI components
import Grid from '@mui/material/Grid';
import ClearIcon from '@mui/icons-material/Clear';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

// Parent component
import GameComponent from './GameComponent';

// Game logic
import TicTacToeLogic, { Move } from './logic/TicTacToe';
import { Player } from './logic/GameLogic';

// Stylesheet
import './TicTacToe.scss'

/**
 * Tic-Tac-Toe (Naughts and Crosses) game w/ AI
 */
export default class TicTacToe extends GameComponent<Move> {
    constructor(props: any) {
        super(props, new TicTacToeLogic())
    }

    render() {
        return (
            <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} sm={6} md={4}>
                    {this.renderBoard()}
                </Grid>
            </Grid>
        );
    }

    protected deserMove(moveSer: string): Move {
        const components = moveSer.split(',').map((value: string) => (
            parseInt(value)
        ));
        return [components[0], components[1]];
    }

    private renderBoard() {
        return (
            <Grid container>
                {this.state.board.map((row, i) => (
                    <Grid key={i} item xs={12} className='board'>
                        {this.renderRow(row, i)}
                    </Grid>
                ))}
            </Grid>
        );
    }

    private renderRow(row: Array<number>, i: number) {
        return (
            <Grid container justifyContent='center' alignItems='center'>
                {row.map((_, j) => {
                    let className: string = (j === 1) ? 'cell vert' : 'cell';
                    if (i === 1) {
                        className += ' horiz';
                    }

                    return (
                        <Grid
                            key={j}
                            item
                            className={className}
                            onClick={async () => await this.onMove([i, j])}
                        > {this.renderPiece(i, j)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    private renderPiece(row: number, col: number) {
        const pieceValue = this.state.board[row][col];

        switch (pieceValue) {
            case Player.HUMAN:
                return <ClearIcon className='piece' />;

            case Player.CPU:
                return <PanoramaFishEyeIcon className='piece' />;

            default:
                return '';
        }
    }
}