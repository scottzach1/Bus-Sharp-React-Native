import React, {Component} from "react";
import NotifService from "../services/NotifService";
import {Alert} from "react-native";

interface Props {

}

interface State {

}

class NotificationProvider extends Component<Props, State> {
    public notif: any;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}

        this.notif = new NotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
        );

        this.notif.scheduleNotif();
    }

    onRegister(token: { token: any; }) {
        this.setState({registerToken: token.token, fcmRegistered: true});
    }

    onNotif(notif: { title: string; message: string | undefined; }) {
        Alert.alert(notif.title, notif.message);
    }

    handlePerm(perms: any) {
        Alert.alert('Permissions', JSON.stringify(perms));
    }

    render() {
        return (
            <>
                {this.props.children}
                {/*<Button*/}
                {/*    title={"notification"}*/}
                {/*    onPress={this.notif.localNotif()}*/}
                {/*/>*/}
            </>
        );
    }

}

export default NotificationProvider;
