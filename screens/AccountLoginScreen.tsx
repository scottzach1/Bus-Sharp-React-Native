import React, {Component} from "react";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import PasswordInput from "../components/account/PasswordInput";
import AccountActionButton from "../components/account/AccountActionButton";
import LoginWithGoogleButton from "../components/account/LoginWithGoogleButton";
import {Route, ScrollView, Text} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import ErrorCard from "../components/account/ErrorCard";
import AuthenticationResponse, {signInWithCredentials} from "../external/Firebase";
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    email: string,
    password: string,
    errorMessage: string | null
}

class AccountLoginScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: null
        };
    }

    async login() {
        this.setState({errorMessage: null});

        const resp: AuthenticationResponse = await signInWithCredentials(this.state.email, this.state.password);

        if (resp.success)
            this.setState({email: '', password: ''});
        else
            this.setState({errorMessage: resp.errorMessage});
    }

    render() {
        return (
            <AccountRedirectWrapper navigation={this.props.navigation} route={this.props.route}>
                <ScrollView>
                    <Card>
                        <Card.Title>Sign In</Card.Title>
                        <Card.Divider/>
                        <EmailInput setEmail={(email) => this.setState({email: email})}/>
                        <PasswordInput setPassword={(password) => this.setState({password: password})}/>
                        <AccountActionButton type={"login"} submit={() => this.login()}/>
                    </Card>
                    <Card>
                        <Card.Title>
                            <Text>Don't have an account? </Text>
                        </Card.Title>
                        <Card.Title onPress={() => this.props.navigation.navigate('SettingsAccountSignupScreen')}>
                            <Text style={{textDecorationLine: "underline"}}>Click here</Text>.
                        </Card.Title>
                        <Card.Divider/>
                        <Text style={{alignSelf: "center"}}>Alternatively, you may</Text>
                        <Text> </Text>
                        <LoginWithGoogleButton type={"login"}/>
                    </Card>
                    <ErrorCard errorMessage={this.state.errorMessage}/>
                </ScrollView>
            </AccountRedirectWrapper>
        );
    }
}

export default AccountLoginScreen;