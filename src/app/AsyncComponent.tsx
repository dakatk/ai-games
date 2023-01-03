import React from "react";

export default class AsyncComponent<P = {}, S = {}> extends React.Component<P, S> {
    /**
     * Call React `setState` in async context
     * 
     * @param newState Updated component state
     */
    protected async setStateAsync(newState: S) {
        return new Promise((resolve) => (
            this.setState(newState, () => resolve(null))
        ));
    }
}