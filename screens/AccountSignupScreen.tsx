import React, {Component} from "react";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import PasswordInput from "../components/account/PasswordInput";
import AccountActionButton from "../components/account/AccountActionButton";
import LoginWithGoogleButton from "../components/account/LoginWithGoogleButton";
import {Text, View} from "../components/common/Themed";
import {Route} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import DisplayNameInput from "../components/account/DisplayNameInput";
import ErrorCard from "../components/account/ErrorCard";
import AuthenticationResponse, {createUserWithCredentials} from "../external/Firebase";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    displayName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    errorMessage: string | null,
}

class AccountSignupScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            displayName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errorMessage: null
        };
    }

    async signup() {
        this.setState({
            errorMessage: null,
        });

        const resp: AuthenticationResponse = await createUserWithCredentials(
            this.state.email,
            this.state.password,
            this.state.passwordConfirmation,
            this.state.displayName,
        );

        if (resp.success) {
            this.setState({
                email: '',
                password: '',
                passwordConfirmation: '',
                displayName: '',
            });
        } else {
            this.setState({
                errorMessage: resp.errorMessage,
            });
        }
    }

    render() {

        console.log('email', this.state.email);

        return (
            <View>
                <Card>
                    <Card.Title>Sign In</Card.Title>
                    <Card.Divider/>
                    <DisplayNameInput setEmail={(name) => this.setState({displayName: name})}/>
                    <EmailInput setEmail={(email) => this.setState({email: email})}/>
                    <PasswordInput
                        setPassword={(password) => this.setState({password: password})}
                    />
                    <PasswordInput
                        setPassword={(password) => this.setState({passwordConfirmation: password})}
                        confirmation={true}
                    />
                    <AccountActionButton type={"signup"} submit={() => this.signup()}/>
                </Card>
                <Card>
                    <Card.Title onPress={() => this.props.navigation.navigate('SettingsAccountLoginScreen')}>
                        Already have an account? <u>Click here</u>.
                    </Card.Title>
                    <Card.Divider/>
                    <Text style={{alignSelf: "center"}}>Alternatively, you may</Text><br/>
                    <LoginWithGoogleButton type={"signup"}/>
                </Card>
                <ErrorCard errorMessage={this.state.errorMessage}/>
            </View>
        );
    }
}

export default AccountSignupScreen;