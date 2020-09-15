import React, {Component} from "react";
import {View} from "react-native";
import {Card} from "react-native-elements";
import {UserContext} from "../providers/UserProvider";
import {getUserDocument} from "../external/Firebase";
import {Text} from "../components/common/Themed";

interface Props {
}

interface State {
    doc: any | null,
}

class AccountInfoScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            doc: null,
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

    generateTable() {
        const doc = this.state.doc;
        if (!doc) return undefined;

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

        console.log('doc', this.state.doc);

        return (
            <View>
                <Card>
                    <Card.Title>User Profile {this.getName()}</Card.Title>
                    <Card.Divider/>
                    {this.generateTable()}
                </Card>
            </View>
        );
    }
}

export default AccountInfoScreen;