// @ts-ignore
import PushNotification from 'react-native-push-notification';
import NotificationHandler from './NotificationHandler';

/**
 * Adapted from https://github.com/zo0r/react-native-push-notification.
 */
export default class NotificationService {
    private lastId: number;
    private lastChannelCounter: number;

    constructor(onRegister: (token: { token: any; }) => void, onNotification: (notify: { title: string; message: string | undefined; }) => void) {
        this.lastId = 0;
        this.lastChannelCounter = 0;

        NotificationHandler.attachRegister(onRegister);
        NotificationHandler.attachNotification(onNotification);

        // Clear badge number at start
        PushNotification.getApplicationIconBadgeNumber(function (number: number) {
            if (number > 0) {
                PushNotification.setApplicationIconBadgeNumber(0);
            }
        });

        PushNotification.getChannels(function (channels: any) {
            console.log(channels);
        });
    }

    createOrUpdateChannel() {
        this.lastChannelCounter++;
        PushNotification.createChannel(
            {
                channelId: "bus-sharp-scheduled-notification-channel", // (required)
                channelName: `Bus Sharp - Counter: ${this.lastChannelCounter}`, // (required)
                channelDescription: `A bus sharp channel to maintain your scheduled services. Updated at: ${Date.now()}`, // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created: any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    popInitialNotification() {
        PushNotification.popInitialNotification((notification: any) => console.log('InitialNotication:', notification));
    }

    scheduleServiceNotification(n: NotificationInstance) {
        this.lastId++;

        const longText = `The bus ${n.serviceCode} (${n.serviceName}) leaves from ${n.stopName} (${n.stopCode}) at ${n.date.toTimeString()}.`;
        const shortText = `Leave now to catch the ${n.serviceCode} in ${n.walkTime} mins`;

        PushNotification.localNotificationSchedule({
            // date: new Date(Date.now() + 30 * 100), // in 3 secs
            date: n.date,

            /* Android Only Properties */
            ticker: longText, // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: longText, // (optional) default: "message" prop
            subText: shortText, // (optional) default: none
            color: 'blue', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'bus_sharp', // (optional) add tag to message
            group: 'bus_sharp_group', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            // actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
            invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

            when: new Date(), // (optional) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string

            /* iOS and Android properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: shortText, // (optional)
            message: longText, // (required)
            userInfo: {screen: "home"}, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: true, // (optional) default: true
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });


    }

    checkPermission(cbk: any) {
        return PushNotification.checkPermissions(cbk);
    }

    requestPermissions() {
        return PushNotification.requestPermissions();
    }

    cancelNotification() {
        PushNotification.cancelLocalNotifications({id: '' + this.lastId});
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }

    abandonPermissions() {
        PushNotification.abandonPermissions();
    }

    getScheduledLocalNotifications(callback: any) {
        PushNotification.getScheduledLocalNotifications(callback);
    }
}

class NotificationInstance {
    public date: Date;
    public walkTime: number;
    public stopCode: string;
    public stopName: string;
    public serviceCode: string;
    public serviceName: string;

    constructor(date: Date, walkTime: number, stopCode: string, stopName: string, serviceCode: string, serviceName: string) {
        this.date = date;
        this.walkTime = walkTime;
        this.stopCode = stopCode;
        this.stopName = stopName;
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
    }
}
