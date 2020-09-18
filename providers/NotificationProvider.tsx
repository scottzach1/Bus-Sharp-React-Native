import React, {Component} from "react";
import NotifService from "../services/NotifService";
import {Alert} from "react-native";

interface Props {
}

interface State {
}

class NotificationProvider extends Component<Props, State> {
    public notify: any;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}

        this.notify = new NotifService(
            this.onRegister.bind(this),
            this.onNotify.bind(this),
        );

        this.notify.scheduleNotif();
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
            <>
                {this.props.children}
            </>
        );
    }

}

export default NotificationProvider;
