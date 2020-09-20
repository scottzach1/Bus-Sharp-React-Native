import {ActivityIndicator, RefreshControl, Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC, useContext, useState} from "react";
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

/**
 * This screen is responsible for showing an account overview for the user when the user is signed in.
 *
 * This screen contains a card showing the users name within the title and the body is a list of all of the users
 * account information stored within Firebase. There is also a logout button that the user can use to stop syncing.
 */
const AccountInfoScreen: FC<Props> = (props) => {
    const context = useContext(UserContext);

    const [userDoc, setUserDoc] = useState<any | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [refreshing, setRefreshing] = React.useState(false);

    /**
     * Callback when screen refreshes.
     */
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        fetchUserDocument(true).then(() => setRefreshing(false));
    }, []);


    /**
     * Gets the user document from Firebase by utilising the FirebaseManager.
     */
    const fetchUserDocument = async (force?: boolean) => {
        if (context && (!userDoc || force)) {
            // Doc hasn't been loaded but user context has.
            setUserDoc(await getUserDocument(context));
        }
    }

    /**
     * Extracts the display name from the user document, if it exists.
     */
    const getName = () => {
        return (userDoc) ? userDoc.displayName : undefined;
    }

    /**
     * Signs out the user from Firebase Authentication, collecting any erros.
     */
    const signOut = () => {
        auth().signOut().catch((e: { message: any }) => setErrorMessage(e.message));
    }

    /**
     * Generates a list of `Text` entries, each mapping to a different property within the user document.
     * If document hasn't loaded, show loading spinner.
     */
    const generateTable = () => {
        if (!userDoc) return <ActivityIndicator/>;

        let listItems: any[] = [];

        for (let property in userDoc) {
            if (!userDoc.hasOwnProperty(property)) continue;
            listItems.push(
                <Text key={`user-info-table-${property}`}>
                    <Text style={{fontWeight: "bold"}}>{property}: </Text>
                    {userDoc[property]}
                </Text>
            );
        }

        return listItems;
    }

    // Load document if hasn't been loaded yet.
    fetchUserDocument().then();

    /**
     * Renders the AccountInfo screen.
     */
    return (
        <AccountRedirectWrapper route={props.route} navigation={props.navigation}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                <Card>
                    <Card.Title>User Profile: {getName()}</Card.Title>
                    <Card.Divider/>
                    {generateTable()}
                    <Card.Divider/>
                    <AccountActionButton type={"logout"} onPress={() => signOut()}/>
                </Card>
                <ErrorCard
                    errorMessage={errorMessage}
                    clearMessage={() => setErrorMessage(null)}
                />
            </ScrollView>
        </AccountRedirectWrapper>
    );
}

export default AccountInfoScreen;
