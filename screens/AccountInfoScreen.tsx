import {ActivityIndicator, Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {Text} from "../components/styles/Themed";
import ErrorCard from "../components/common/ErrorCard";
import AccountActionButton from "../components/account/AccountActionButton";
import {Card} from "react-native-elements";
import {getUserDocument} from "../external/FirebaseManager";
import auth from '@react-native-firebase/auth';
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";
import {UserContext} from "../providers/UserProvider";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    doc: any | null,
    errorMessage: string | null,
}

/**
 * This screen is responsible for showing an account overview for the user when the user is signed in.
 *
 * This screen contains a card showing the users name within the title and the body is a list of all of the users
 * account information stored within Firebase. There is also a logout button that the user can use to stop syncing.
 */
class AccountInfoScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            doc: null,
            errorMessage: null,
        }
    }

    /**
     * Get user document when component loads. This will wait until the document is received within Firebase.
     */
    async componentDidMount() {
        await this.getUserDocument();
    }

    /**
     * Gets the user document from Firebase by utilising the FirebaseManager.
     */
    async getUserDocument() {
        if (this.context && !this.state.doc) {
            // Doc hasn't been loaded but user context has.
            this.setState({
                doc: await getUserDocument(this.context)
            });
        }
    }

    /**
     * Extracts the display name from the user document, if it exists.
     */
    getName() {
        return (this.state.doc) ? this.state.doc.displayName : undefined;
    }

    /**
     * Signs out the user from Firebase Authentication, collecting any erros.
     */
    signOut() {
        auth().signOut().catch((e: { message: any }) => this.setState({errorMessage: e.message}));
    }

    /**
     * Generates a list of `Text` entries, each mapping to a different property within the user document.
     * If document hasn't loaded, show loading spinner.
     */
    generateTable() {
        const doc = this.state.doc;
        if (!doc) return <ActivityIndicator/>;

        let listItems: any[] = [];

        for (let property in doc) {
            if (!doc.hasOwnProperty(property)) continue;
            listItems.push(
                <Text key={`user-info-table-${property}`}>
                    <Text style={{fontWeight: "bold"}}>{property}: </Text>
                    {doc[property]}
                </Text>
            );
        }

        return listItems;
    }

    /**
     * Renders the AccountInfo screen.
     */
    render() {
        // Load document if hasn't been loaded yet.
        this.getUserDocument().then();

        return (
            <AccountRedirectWrapper route={this.props.route} navigation={this.props.navigation}>
                <ScrollView>
                    <Card>
                        <Card.Title>User Profile: {this.getName()}</Card.Title>
                        <Card.Divider/>
                        {this.generateTable()}
                        <Card.Divider/>
                        <AccountActionButton type={"logout"} onPress={() => this.signOut()}/>
                    </Card>
                    <ErrorCard
                        errorMessage={this.state.errorMessage}
                        clearMessage={() => this.setState(() => this.setState({errorMessage: null}))}
                    />
                </ScrollView>
            </AccountRedirectWrapper>
        );
    }

}

export default AccountInfoScreen;
