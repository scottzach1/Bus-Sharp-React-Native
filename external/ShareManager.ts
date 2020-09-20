// @ts-ignore Unfortunately it doesn't seem to find the import. Works totally fine however.
import Toast from "react-native-toast-message";
import {Share, ShareDismissedAction, ShareSharedAction} from "react-native";

/**
 * DESCRIPTION: This file acts as as a library that handles all sharing interactions. This library utilises both the
 * Share API exposed by React Native and falls back the clipboard notifying the user via a Toast.
 */

/**
 * Attempts to share information natively on the device via the Share API exposed by React Native.
 * If this cannot be used, then we copy the message to the users clipboard and notify them via a toast.
 *
 * @param title - of the share context to display.
 * @param message - the body of the message to share.
 * @param url - linking to the desired target.
 */
export const doShare = async (title: string, message: string, url: string) => {
    try {
        // First try share via React Native's Share API.
        const result = await Share.share({
            title: title,
            message: message,
            url: url,
        });
        return new ShareResponse(true, null, result.action);
    } catch (e) {
        // Failed to open share API, resort to clipboard share.
        navigator.clipboard.writeText(message)
            .then(() => {
                Toast.show({
                    position: 'bottom',
                    type: 'info',
                    text1: 'Copied to clipboard',
                    visibilityTime: 4000,
                    autoHide: true
                })
                return new ShareResponse(true, null, "Clipboard");
            })
            .catch(() => {
                Toast.show({
                    position: 'bottom',
                    type: 'error',
                    text1: 'Failed to share or copy to clipboard',
                    visibilityTime: 4000,
                    autoHide: true
                })
                return new ShareResponse(false, "Failed to copy to clipboard", "None");
            });
    }
}

/**
 * The different types of share actions that can occur.
 */
type ShareResponseType = ShareSharedAction["action"] | ShareDismissedAction["action"] | "Clipboard" | "None";

/**
 * Defines the return type of ShareManager invocations.
 */
export class ShareResponse {
    public success: boolean;
    public errorMessage: string | null;
    public type: ShareResponseType;

    /**
     * Constructs a new ShareResponse.
     *
     * @param success - success / failure of the action (clipboard is still success).
     * @param errorMessage - any errors encountered when trying to share (clipboard is still success).
     * @param type - The type of action that was performed (see `ShareResponseType`).
     */
    constructor(success: boolean, errorMessage: string | null, type: ShareResponseType) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.type = type;
    }
}
