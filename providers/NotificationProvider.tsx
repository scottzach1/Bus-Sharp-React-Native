import React, {Component, createContext} from "react";
import NotificationService from "../services/NotificationService";
import {Alert} from "react-native";

interface Props {
}

interface State {
}

/**
 * The context containing the `NotificationService` that can be interacted with to utilise its service functions.
 */
export const NotificationContext = createContext<NotificationService | undefined>(undefined);

/**
 * This component is responsible for exposing the `NotificationContext` to the rest of the application. This component
 * can be interacted with to share information with the user.
 */
class NotificationProvider extends Component<Props, State> {
    public notify: any;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}

        this.notify = new NotificationService(
            this.onRegister.bind(this),
            this.onNotify.bind(this),
        );
    }

    /**
     * Called when token is generated (IOS and Android).
     *
     * @param token - token generated.
     */
    onRegister(token: { token: any; }) {
        this.setState({registerToken: token.token, fcmRegistered: true});
    }

    /**
     * Called when remote or local notification is opened or received (We are only using local).
     *
     * @param notify - notification.
     */
    onNotify(notify: { title: string; message: string | undefined; }) {
        Alert.alert(notify.title, notify.message);
    }

    /**
     * Render provider to expose NotificationContext to the rest of the application.
     */
    render() {
        return (
            <NotificationContext.Provider value={this.notify}>
                {this.props.children}
            </NotificationContext.Provider>
        );
    }

}

export default NotificationProvider;
