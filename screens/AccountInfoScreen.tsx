import React, {Component} from "react";
import {ActivityIndicator, Route, ScrollView} from "react-native";
import {Card} from "react-native-elements";
import {UserContext} from "../providers/UserProvider";
import {getUserDocument, signOut} from "../external/Firebase";
import {Text} from "../components/common/Themed";
import AccountActionButton from "../components/account/AccountActionButton";
import ErrorCard from "../components/account/ErrorCard";
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";
import {StackNavigationProp} from "@react-navigation/stack";

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

    componentDidMount() {
        this.getUserDocument();
    }

    getUserDocument() {
        if (this.context && !this.state.doc) {
            getUserDocument(this.context).then((doc: any | null) => {
                this.setState({doc: doc});
            });
        }
    }

    getName() {
        return (this.state.doc) ? this.state.doc.displayName : undefined;
    }

    signOut() {
        signOut().catch((e: { message: any }) => this.setState({errorMessage: e.message}));
    }

    generateTable() {
        const doc = this.state.doc;
        if (!doc) return <ActivityIndicator/>;

        let listItems: any[] = [];

        for (let property in doc) {
            if (!doc.hasOwnProperty(property)) continue;
            listItems.push(
                <Text>
                    <b>{property}:</b> {doc[property]}
                </Text>
            )
        }

        return listItems;
    }

    render() {
        this.getUserDocument();

        return (
            <AccountRedirectWrapper navigation={this.props.navigation} route={this.props.route}>
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