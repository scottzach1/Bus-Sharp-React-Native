import React, {Component} from "react";
import {ButtonGroup} from "../styles/Themed";

/**
 * UpdateIndex: a callback function to update the parent component with the currently selected item.
 */
interface Props{
    updateIndex: (e: number) => void
}

/**
 * SelectedIndex: Maintains a record of the currently selected item.
 */
interface State{
    selectedIndex: number
}

/**
 * A component that renders in a ButtonGroup that can alter the filter options presented to the user.
 */
class SearchTabFilter extends Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            selectedIndex: 0
        }
    }

    updateIndex(e:number) {
        this.props.updateIndex(e);
        this.setState({selectedIndex: e})
    }

    render() {
        const buttons = ["All", "Routes", "Stops", "Exact"]
        const { selectedIndex } = this.state

        return (
            <ButtonGroup
                onPress={(e: number) => this.updateIndex(e)}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: 50}}
            />
        )
    }

}

export default SearchTabFilter
