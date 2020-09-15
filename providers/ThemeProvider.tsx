import React, {Component} from "react";
import {ThemeProvider} from "react-native-elements";

class CustomThemeProvider extends Component {

    state = {
        theme: {
            colors: {
                platform: {
                    "default": {
                        "grey": "#FFF"
                    }
                }
            }
        }
    }


    render() {
        return (
            <ThemeProvider theme={this.state.theme}>
                {this.props.children}
            </ThemeProvider>
        );
    }
}

export default CustomThemeProvider;