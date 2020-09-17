import {ActivityIndicator, Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {Text} from "../components/styles/Themed";
import ErrorCard from "../components/account/ErrorCard";
import AccountActionButton from "../components/account/AccountActionButton";
import {Card} from "react-native-elements";
import {getUserDocument} from "../external/Firebase";
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

class AccountInfoScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            doc: null,
            errorMessage: null,
        }
    }

    async componentDidMount() {
        await this.getUserDocument();
    }

    async getUserDocument() {
        if (this.context && !this.state.doc) {
            this.setState({
                doc: await getUserDocument(this.context)
            });
        }
    }

    getName() {
        return (this.state.doc) ? this.state.doc.displayName : undefined;
    }

    signOut() {
        auth().signOut().catch((e: { message: any }) => this.setState({errorMessage: e.message}));
    }

    generateTable() {
        const doc = this.state.doc;
        if (!doc) return <ActivityIndicator/>;

        let listItems: any[] = [];

        for (let property in doc) {
            if (!doc.hasOwnProperty(property)) continue;
            listItems.push(
                <Text>
                    <Text style={{fontWeight: "bold"}}>{property}: </Text>
                    {doc[property]}
                </Text>
            );
        }

        return listItems;
    }

    render() {
        this.getUserDocument().then();

        return (
            <AccountRedirectWrapper route={this.props.route} navigation={this.props.navigation}>
                <ScrollView>
                    <Card>
                        <Card.Title>User Profile {this.getName()}</Card.Title>
                        <Card.Divider/>
                        {this.generateTable()}
                        <Card.Divider/>
                        <AccountActionButton type={"logout"} submit={() => this.signOut()}/>
                    </Card>
                    <ErrorCard errorMessage={this.state.errorMessage}/>
                </ScrollView>
            </AccountRedirectWrapper>
        );
    }

}

export default AccountInfoScreen;