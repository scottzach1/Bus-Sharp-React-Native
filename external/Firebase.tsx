import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-community/google-signin';
import {getSavedServices, getSavedStops} from "./StorageManager";

/**
 * Signs into a user with provided credentials.
 *
 * @param email: Of user account.
 * @param password: Of user account
 * @return AuthenticationResponse: Containing success / failure and error message.
 */
export const signInWithCredentials = async (email: string, password: string) => {
    if (!email) return new AuthenticationResponse(false, 'Email is empty!');
    if (!password) return new AuthenticationResponse(false, 'Password is empty!')

    return await auth().signInWithEmailAndPassword(email, password)
        .then(() => new AuthenticationResponse(true))
        .catch((e) => new AuthenticationResponse(false, e.message));
}

/**
 * Creates a user with provided credentials and information.
 *
 * @param email: Of user account.
 * @param password: Of user account
 * @param passwordConfirmation: Of user account (verify intended credentials).
 * @param displayName: Of user to save.
 * @return AuthenticationResponse: Containing success / failure and error message.
 */
export const createUserWithCredentials = async (email: string, password: string, passwordConfirmation: string, displayName: string) => {
    if (!displayName) return new AuthenticationResponse(false, "Display name is empty!");
    if (!email) return new AuthenticationResponse(false, "Email is empty!");
    if (!password) return new AuthenticationResponse(false, "Password is empty!");

    if (password !== passwordConfirmation)
        return new AuthenticationResponse(false, "Passwords don't match!");

    return await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (user) => {
            return generateUserDocument(user.user, {
                displayName: displayName,
                savedStops: JSON.stringify((await getSavedStops()).data),
                savedServices: JSON.stringify((await getSavedServices()).data),
            })
                .then(() => new AuthenticationResponse(true))
                .catch(() => new AuthenticationResponse(false, "Auth successful, failed to generate user doc!"))
        })
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


export const resetAccountPassword = async (email: string) => {
    if (!email) return new AuthenticationResponse(false, "Email is empty!");

    return await auth().sendPasswordResetEmail(email)
        .then(() => new AuthenticationResponse(true))
        .catch((e) => new AuthenticationResponse(false, e.message));
}


/**
 * Signs into Google with a new popup window. Note: For this to work the component
 * must be mounted with a GoogleSignin configuration.
 * TODO This is not working yet.
 * @return AuthenticationResponse: Containing success / failure and error message.
 */
export const signInWithGoogle = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
        .then(() => new AuthenticationResponse(true))
        .catch(() => new AuthenticationResponse(false, "FAILED"));
}

/**
 * Updates the users document in firestore with the data attributes within `additionalData`.
 *
 * @param user: User reference to update user's document in firestore.
 * @param additionalData: Data to update within Firestore.
 */
export const updateUserDocument = async (user: FirebaseAuthTypes.User | null, additionalData: any) => {
    if (!user || !user.uid) return;

    firestore().doc(`users/${user.uid}`).update(additionalData);
}

/**
 * Gets the user document from Firestore, creating a new entry if one isn't present.
 *
 * @param user: User reference to obtain / create user's document in firestore.
 * @param additionalData: Data to set within Firestore if creating entry.
 */
export const generateUserDocument = async (user: FirebaseAuthTypes.User | null, additionalData?: any | undefined) => {
    if (!user || !user.uid) return;

    firestore().doc(`users/${user.uid}`).get().then((snapShot) => {
        if (!snapShot.exists) snapShot.ref.update(additionalData);
    });
}

/**
 * Get the users document stored within firestore.
 *
 * @param user: User reference to get user's document in firestore.
 * @return any | null: Object with document if present, `null` otherwise.
 */
export const getUserDocument = async (user: FirebaseAuthTypes.User) => {
    return await firestore().collection('users').doc(user.uid).get().then((snap) => snap.data());
}

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