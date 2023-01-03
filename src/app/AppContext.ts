// Basic React stuff
import React from 'react';

// AI stuff
import AiType from './ai/AiType';

/**
 * App context data
 */
export interface AppContextData {
    /**
     * Selected AI type
     */
    aiType: AiType;
    /**
     * Optional search depth
     */
    searchDepth?: number;
    /**
     * Maximum expected score for any given game state
     */
    maxScore?: number;
    /**
     * Default bead count for MENACE AI
     */
    defaultBeads?: number;

    // Pay no attention to the man behind the curtain...
    // (this is strongly typed, I swear)
    [_: string]: any;
}

/**
 * App context
 */
export const AppContext: React.Context<AppContextData> = React.createContext({
    aiType: AiType.NEGAMAX as AiType
});

/**
 * Default app context
 */
export const DEFAULT_CONTEXT: AppContextData = {
    aiType: AiType.NEGAMAX
};
