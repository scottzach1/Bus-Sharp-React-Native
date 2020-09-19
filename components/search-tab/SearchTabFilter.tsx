import React, {Component} from "react";
import {ButtonGroup} from "react-native-elements";

interface Props{
    updateIndex: (e: number) => void
}

interface State{
    selectedIndex: number
}

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
                onPress={(e) => this.updateIndex(e)}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: 50}}
            />
        )
    }

}

export default SearchTabFilter
