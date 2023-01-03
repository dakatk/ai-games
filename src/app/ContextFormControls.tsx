// Basic React stuff
import React from 'react';

// MUI components
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

// App context
import { AppContextData } from './AppContext';

// AI stuff
import AiType from './ai/AiType';

// Custom string functions (util)
import { capitalize } from '../util/String';

// Stylesheet
import './ContextFormControls.scss';

/**
 * Context form controls component props
 */
interface ContextFormProps {
    /**
     * App context (shared with `App` component)
     */
    context: AppContextData;
    /**
     * Callback for updating the app context
     */
    updateContext: (context: AppContextData) => Promise<void>;
}

/**
 * Form control rendering data
 */
interface GenericFormControl {
    /**
     * App context key
     */
    contextKey: string,
    /**
     * Form input label
     */
    label: string
}

/**
 * Form control inputs that affect the app context
 */
export default class ContextFormControls extends React.Component<ContextFormProps> {
    // Form control rendering callbacks for each individual AI type
    private aiFormControls: Record<AiType, Array<GenericFormControl>> = {
        [AiType.NEGAMAX]: [
            {
                contextKey: 'searchDepth',
                label: 'Max Search Depth'
            }
        ],
        [AiType.MENACE]: [
            {
                contextKey: 'defaultBeads',
                label: 'Default Bead Count'
            }
        ],
    };

    /**
     * 
     * @param contextKey 
     * @param value 
     */
    private async updateAppContext(contextKey: string, value: any) {
        let context: AppContextData = {
            ...this.props.context
        };
        // This is not type-safe. Don't do this if you can help it
        context[contextKey] = value;

        await this.props.updateContext(context);
    }

    // ====================== Event handlers =============================

    /**
     * Update context when value of any form control field changes
     */
    private async handleNumericFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, contextKey: string) {
        const value: number = parseInt(event.target.value);
        await this.updateAppContext(contextKey, value);
    }

    /**
     * Event handler for AI selection change
     */
    private async handleAiSelect(event: SelectChangeEvent): Promise<void> {
        // Attempt to parse AI name from selected value
        let aiName: string = event?.target?.value?.toUpperCase() || AiType.NEGAMAX;

        // If parsed name isn't in the `AiType` enum, 
        // default to using the Negamax AI
        if (!(aiName in AiType)) {
            aiName = AiType.NEGAMAX;
        }

        // Convert string to enum
        const aiType: AiType = AiType[aiName as keyof typeof AiType];

        // Update app context
        let context: AppContextData = {
            ...this.props.context,
            aiType
        };
        await this.props.updateContext(context);
    }

    // ====================== Component rendering ========================

    /**
     * Form control inputs that affect the App Context
     */
    render() {
        return (
            <Box>
                <FormControl variant='standard' fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>
                    <InputLabel id='ai-select-label'>AI</InputLabel>
                    <Select
                        id='ai-select'
                        labelId='ai-select-label'
                        defaultValue={AiType.NEGAMAX}
                        onChange={async (e: SelectChangeEvent) => await this.handleAiSelect(e)}
                        sx={{ m: 1 }}
                    >
                        {Object.values(AiType).map((aiType: AiType) => (
                            <MenuItem
                                key={aiType} 
                                value={aiType}
                            >
                                {capitalize(aiType)}
                            </MenuItem>
                        ))}
                    </Select>
                    
                    <TextField
                        id='max-score-input'
                        label='Max Score'
                        type='number'
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={async (e) => (
                            await this.handleNumericFieldChange(e, 'maxScore')
                        )}
                        variant='standard'
                        sx={{ m: 1, mt: 0 }}
                    />

                    {this.renderGenericFormControls(
                        this.aiFormControls[this.props.context.aiType as AiType]
                    )}
                </FormControl>
            </Box>
        );
    }

    private renderGenericFormControls(formControls: Array<GenericFormControl>): JSX.Element[] {
        return formControls.map((formControl: GenericFormControl) => (
            <TextField
                id={formControl.label.toLowerCase().split(' ').join('-')}
                label={formControl.label}
                type='number'
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={async (e) => (
                    await this.handleNumericFieldChange(e, formControl.contextKey)
                )}
                variant='standard'
                sx={{ m: 1, mt: 0 }}
            />
        ));
    }
}