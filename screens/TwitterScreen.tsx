import React, {Component} from "react";
import TwitterFeedContainer from "../components/twitter/TwitterFeedContainer";

interface Props {
}

interface State {
}

class TwitterScreen extends Component<Props, State> {
    render() {
        return (
            <TwitterFeedContainer/>
        );
    }
}

export default TwitterScreen;