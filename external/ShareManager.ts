// @ts-ignore Unfortunately it doesn't seem to find the import. Works totally fine however.
import Toast from "react-native-toast-message";
import {Share} from "react-native";

export const doShare = async (title: string, message: string, url: string) => {
    try {
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
            })
            .catch(() => {
                Toast.show({
                    position: 'bottom',
                    type: 'error',
                    text1: 'Failed to share or copy to clipboard',
                    visibilityTime: 4000,
                    autoHide: true
                })
            });
    }
}

class ShareResponse {
    public success: boolean;
    public errorMessage: string | null;
    public type: string | null;

    constructor(success: boolean, errorMessage?: string | null, type?: string) {
        this.success = success;
        this.errorMessage = (errorMessage) ? errorMessage : null;
        this.type = (type) ? type : null;
    }
}
