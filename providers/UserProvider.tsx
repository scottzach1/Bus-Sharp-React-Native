import React, {createContext, FC, useEffect, useState} from "react";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {syncSavedData} from "../external/StorageManager";
import {generateUserDocument} from "../external/Firebase";

interface Props {
}


export const UserContext = createContext<FirebaseAuthTypes.User | null | undefined>(undefined);

const UserProvider: FC<Props> = (props) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(undefined);

    // Handle user state changes
    async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
        await generateUserDocument(user).then(() => syncSavedData(user));
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;