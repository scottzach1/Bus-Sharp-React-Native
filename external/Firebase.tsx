// import * as firebase from 'firebase';
// import '@firebase/auth';
// import '@firebase/firestore';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-community/google-signin';


// const firebaseConfig = {
//     apiKey: Constants.manifest.extra.REACT_APP_FIREBASE_APP_API_KEY,
//     authDomain: Constants.manifest.extra.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: Constants.manifest.extra.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: Constants.manifest.extra.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: Constants.manifest.extra.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: Constants.manifest.extra.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
//     appId: Constants.manifest.extra.REACT_APP_FIREBASE_ID,
//     measurementId: Constants.manifest.extra.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

export const signInWithCredentials = async (email: string, password: string) => {
    return await auth().signInWithEmailAndPassword(email, password)
        .then(() => new AuthenticationResponse(true))
        .catch((e) => new AuthenticationResponse(false, e.message));
}

export const createUserWithCredentials = async (email: string, password: string, passwordConfirmation: string, displayName: string) => {
    if (password !== passwordConfirmation)
        return new AuthenticationResponse(false, "Passwords don't match!");

    return await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => new AuthenticationResponse(true))
        .catch((e) => {
            let message: string;

            switch (e.code) {
                case 'auth/email-already-in-use':
                    message = "That email address is already in use!";
                    break;
                case 'auth/invalid-email':
                    message = 'That email address is invalid!';
                    break;
                case 'auth/operation-not-allowed':
                    message = 'Operation not allowed! (contact devs at feedback@welly.live)'
                    break;
                default:
                    message = 'An unknown error has occurred. :\'(';
                    break;
            }

            return new AuthenticationResponse(false, message);
        });
}

export const signInWithGoogle = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}


export const updateUserDocument = async (user: FirebaseAuthTypes.User | null, additionalData: any) => {
    if (!user || !user.uid) return;

    firestore().doc(`users/${user.uid}`).update(additionalData);
}

export const generateUserDocument = async (user: any | null, additionalData?: any | undefined) => {
    if (!user || !user.uid) return;

    firestore().doc(`users/${user.uid}`).get().then((snapShot) => {
        if (!snapShot.exists) snapShot.ref.update(additionalData);
    });
}

export const getUserDocument = async (user: FirebaseAuthTypes.User) => {
    return await firestore().doc(`users/${user.uid}`).get();
}


/**
 * NOTE: This file was heavily inspired from the following blog post (as well as official documentation):
 * - "https://blog.logrocket.com/user-authentication-firebase-react-apps/"
 * The code was listed under MIT, and has been heavily altered to meet this projects requirements.
 */

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
//
// // Export global components.
// export const auth = firebase.auth();
// export const firestore = firebase.firestore();
//
// // Sign in with Google
// const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// export const signInWithGoogle = () => {
//     auth.signInWithPopup(googleAuthProvider).catch(e => console.error("Failed to sign in with pop up", e));
// }
//
// export const signOut = async () => {
//     await auth.signOut();
// }

/**
 * Gets the user document from Firestore, creating a new entry if one isn't present.
 *
 * @param user: User reference to obtain / create user's document in firestore.
 * @param additionalData: Data to set within Firestore if creating entry.
 *
 // export const generateUserDocument = async (user: any | null, additionalData?: any | undefined) => {
    // if (!user) return null;
    //
    // // Get user firestore entry.
    // const userRef = firestore.doc(`users/${user.uid}`);
    // const document = await userRef.get();
    //
    // // User not in database, create new entry.
    // if (!document.exists) {
    //     const {email, displayName} = user;
    //     await userRef.set({
    //         displayName,
    //         email,
    //         ...additionalData
    //     }).catch((e) => console.error("Error creating user document", e));
    // }
    //
    // // Get entry from database.
    // return getUserDocument(user);
// };

 /**
 * Updates the users document in firestore with the data attributes within `additionalData`.
 *
 * @param user: User reference to update user's document in firestore.
 * @param additionalData: Data to update within Firestore.
 */
// export const updateUserDocument = async (user: any | null, additionalData: any) => {
// if (!user) return;
//
// // Get user firestore entry.
// const userRef = firestore.doc(`users/${user.uid}`);
//
// await userRef.update({
//     ...additionalData
// }).catch((e) => console.error("Error updating user document", e));
// }

/**
 * Get the users document stored within firestore.
 *
 * @param user: User reference to get user's document in firestore.
 * @return any | null: Object with document if present, `null` otherwise.
 */
// export const getUserDocument = async (user: any) => {
// const uid: string = user.uid;
//
// if (!uid) return null;
//
// return await firestore.doc(`users/${uid}`).get()
//     .then((userDocument) => {
//         return {uid, ...userDocument.data()};
//     })
//     .catch((e) => {
//         console.error("Error fetching user", e);
//         return null;
//     });
// };

/**
 * Signs into a user with provided credentials.
 *
 * @param email: Of user account.
 * @param password: Of user account
 * @return AuthenticationResponse: Containing success / failure and error message.
 */
// export const signInWithCredentials = async (email: string, password: string) => {
// return auth.signInWithEmailAndPassword(email, password)
//     .then(() => new AuthenticationResponse(true))
//     .catch((e) => new AuthenticationResponse(false, e.message));
// }

/**
 * Creates a user with provided credentials and information.
 *
 * @param email: Of user account.
 * @param password: Of user account
 * @param passwordConfirmation: Of user account (verify intended credentials).
 * @param displayName: Of user to save.
 * @return AuthenticationResponse: Containing success / failure and error message.
 */
// export const createUserWithCredentials = async (email: string, password: string, passwordConfirmation: string, displayName: string) => {
// if (password !== passwordConfirmation)
//     return new AuthenticationResponse(false, "Passwords don't match!");
//
// try {
//     const {user} = await auth.createUserWithEmailAndPassword(email, password);
//
//     await generateUserDocument(user, {
//         displayName: displayName,
//         savedStops: JSON.stringify((await getSavedStops()).data),
//         savedServices: JSON.stringify((await getSavedServices()).data),
//     });
//     return new AuthenticationResponse(true);
// } catch (error) {
//     return new AuthenticationResponse(false, error.message);
// }
// }

/**
 * Describes the return type of requests.
 */
class AuthenticationResponse {
    public success: boolean;
    public errorMessage: string | null;

    /**
     * Describes the return type of requests.
     *
     * @param success: `true` if successful, `false` otherwise.
     * @param errorMessage: (Optional) to notify user.
     */
    constructor(success: boolean, errorMessage?: string) {
        this.success = success;
        this.errorMessage = (errorMessage) ? errorMessage : null;
    }
}

export default AuthenticationResponse;