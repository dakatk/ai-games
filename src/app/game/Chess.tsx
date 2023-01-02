// MUI components
import Box from '@mui/material/Box';

// Parent component
import GameComponent, { GameProps } from './GameComponent';

// Game logic
import ChessLogic from './logic/Chess';

// Chess library
import { Move } from '../../lib/chess';

// Stylesheet
import './Chess.scss'

/**
 * Chess game w/ AI
 */
export default class Chess extends GameComponent<Move | string> {
    constructor(props: GameProps) {
        super(props, new ChessLogic());
    }

    render() {
        return <Box>Chess</Box>
    }
}