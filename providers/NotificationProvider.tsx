import React, {Component, createContext} from "react";
import NotificationService from "../services/NotificationService";
import {Alert} from "react-native";

interface Props {
}

interface State {
}

export const NotificationContext = createContext<NotificationService | undefined>(undefined);

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

    onRegister(token: { token: any; }) {
        this.setState({registerToken: token.token, fcmRegistered: true});
    }

    onNotify(notify: { title: string; message: string | undefined; }) {
        Alert.alert(notify.title, notify.message);
    }

    handlePerm(perms: any) {
        Alert.alert('Permissions', JSON.stringify(perms));
    }

    render() {
        return (
            <NotificationContext.Provider value={this.notify}>
                {this.props.children}
            </NotificationContext.Provider>
        );
    }

}

export default NotificationProvider;
