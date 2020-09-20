import {StackNavigationProp} from "@react-navigation/stack";
import {Route, ScrollView} from "react-native";
import React, {Component} from "react";
import {Text} from "../components/styles/Themed";
import {AuthenticationResponse, createUserWithCredentials, signInWithGoogle} from "../external/FirebaseManager";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import PasswordInput from "../components/account/PasswordInput";
import AccountActionButton from "../components/account/AccountActionButton";
import LoginWithGoogleButton from "../components/account/LoginWithGoogleButton";
import DisplayNameInput from "../components/account/DisplayNameInput";
import ErrorCard from "../components/common/ErrorCard";
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";
import {GoogleSignin} from "@react-native-community/google-signin";
import AccountBlurb from "../components/account/AccountBlurb";

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

/**
 * This screen is responsible for handling any user signup activities. This can include with credentials (display name +
 * username + password + password confirmation) or via the signup with Google with Google button.
 *
 * The user should also be able to use this screen to navigate to the sign up screen and the forgot password screen.
 *
 * Sadly login with Google is currently broken :'/.
 */
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

    /**
     * Attempt to configure sign in with Google authentication (in case user clicks button).
     *
     * This requires configuration but sadly wasn't working as we appear to require a different API key.
     * See here: https://rnfirebase.io/auth/social-auth#google
     */
    componentDidMount() {
        GoogleSignin.configure({
            // webClientId: "483376447021-ev7ocmauqblulvsfppk05pokj638uamg.apps.googleusercontent.com",
        });
    }

    /**
     * Signs up and authenticates the user with Firebase using email and password credentials, as well as a display name
     * (for user profile). This is handled by the FirebaseManager. Any errors are propagated to the users via the
     * `errorMessage` state.
     */
    async signupWithUserCredentials() {
        this.setState({
            errorMessage: null,
        });

        const resp: AuthenticationResponse = await createUserWithCredentials(
            this.state.email,
            this.state.password,
            this.state.passwordConfirmation,
            this.state.displayName,
        );

        this.setState({
            errorMessage: resp.errorMessage,
        });
    }

    /**
     * Renders the Account Signup screen.
     */
    render() {
        return (
            <AccountRedirectWrapper route={this.props.route} navigation={this.props.navigation}>
                <ScrollView>
                    {/* Sign up with credentials. */}
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
                        <AccountActionButton type={"signup"} onPress={() => this.signupWithUserCredentials()}/>
                    </Card>
                    {/* Other links and sign in with Google. */}
                    <Card>
                        <AccountBlurb type={"login"} navigation={this.props.navigation}/>
                        <Card.Divider/>
                        <Text style={{alignSelf: "center"}}>Alternatively, you may</Text>
                        <Text> </Text>
                        <LoginWithGoogleButton type={"signup"} onPress={() => signInWithGoogle()}/>
                    </Card>
                    <ErrorCard
                        errorMessage={this.state.errorMessage}
                        clearMessage={() => this.setState({errorMessage: null})}
                    />
                </ScrollView>
            </AccountRedirectWrapper>
        );
    }
}

export default AccountSignupScreen;
