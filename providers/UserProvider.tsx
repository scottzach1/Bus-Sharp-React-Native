import React, {createContext, FC, useEffect, useState} from "react";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {syncSavedData} from "../external/StorageManager";
import {generateUserDocument} from "../external/FirebaseManager";

interface Props {
}

/**
 * The different states that the UserContext may be in.
 * undefined: Context has not loaded yet.
 * null: Context loaded, no user authenticated.
 * User: Context loaded, user authenticated.
 */
type UserContextType = FirebaseAuthTypes.User | null | undefined;

/**
 * The context containing the user profile to be exposed to the rest of the application.
 */
export const UserContext = createContext<UserContextType>(undefined);

/**
 * This component is responsible for exposing the `UserContext` to the rest of the application. This component can have
 * one of three states (see `UserContextType`) and will update on user state change.
 *
 * @param props - None used.
 */
const UserProvider: FC<Props> = (props) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<UserContextType>(undefined);

    // Handle user state changes
    async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
        await generateUserDocument(user).then(() => syncSavedData(user));
    }

    // Subscribe to any auth changes.
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Provider to expose UserContext to rest of the application.
    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;
