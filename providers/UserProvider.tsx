import React, {createContext, FC, useEffect, useState} from "react";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface Props {

}

export const UserContext = createContext<FirebaseAuthTypes.User | null | undefined>(undefined);

const UserProvider: FC<Props> = (props) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(undefined);

    // Handle user state changes
    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
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