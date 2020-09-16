import AsyncStorage from '@react-native-community/async-storage';
// import firebase from "firebase";
import {getUserDocument, updateUserDocument} from "./Firebase";
import csv from 'csvtojson';
import {FirebaseAuthTypes} from "@react-native-firebase/auth";

const StorageKeys = {
    savedServices: '@savedServices',
    savedStops: '@savedStops',
    allStops: '@cachedStopNames',
    allServices: '@cachedServiceNames',
    cachedStops: '@cachedStopData',
    cachedServices: '@cachedServiceData',
    userTheme: '@savedTheme',
}

/* Initialisation Methods */

/**
 * Initialises the user theme within local storage if not set. This will default to 'auto'.
 */
export const initTheme = async () => {
    const key = StorageKeys.userTheme;

    const setToDefault = () => AsyncStorage.setItem(key, 'auto');

    AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) setToDefault();
        })
        .catch((error) => {
            console.error('Failed to initialise user theme', error);
            setToDefault();
        });
}

/**
 * Initialises the saved stops within local storage. If there is no array, then this function
 * will initialise it with an empty array.
 */
export const initSavedStops = async () => {
    const key = StorageKeys.savedStops;

    const setToDefault = () => AsyncStorage.setItem(key, JSON.stringify([]));

    AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) setToDefault();
        })
        .catch((error) => {
            console.error('Failed to initialise saved stops.', error);
            setToDefault();
        });
}

/**
 * Initialises the saved external within local storage. If there is no array, then this function
 * will initialise it with an empty array.
 */
export const initSavedServices = async () => {
    const key = StorageKeys.savedServices;

    const setToDefault = () => AsyncStorage.setItem(key, JSON.stringify([]));

    AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) setToDefault();
        })
        .catch((error) => {
            console.error('Failed to initialise saved services.', error);
            setToDefault();
        });
}

/**
 * Initialises the stop data within local storage. If there is no array, then this function
 * will initialise it with the latest pull of stop data from the transit-feeds website.
 */
export const initStops = async () => {
    const key = StorageKeys.allStops;
    const url = "http://transitfeeds.com/p/metlink/22/latest/download/stops.txt";

    const setToDefault = async () => {
        await fetch(url)
            .then((resp) => resp.text())
            .then((text) => {
                csv().fromString(text)
                    .then((jsonObj) => {
                        let stopData: any = {};

                        for (const stopEntry of jsonObj)
                            stopData[stopEntry.stop_id] = stopEntry;

                        stopData[''] = undefined; // Dataset contains empty entry :-/

                        AsyncStorage.setItem(key, JSON.stringify(stopData));
                    });
            });
    }

    const response = await AsyncStorage.getItem(key).catch((e) => console.error('Failed to initialise all stops.', e));

    if (!response) await setToDefault();
}


/**
 * Initialises the service data within local storage. If there is no array, then this function
 * will initialise it with the latest pull of stop data from the transit-feeds website.
 */
export const initServices = async () => {
    const key = StorageKeys.allServices;
    const url = "http://transitfeeds.com/p/metlink/22/latest/download/routes.txt";

    const setToDefault = async () => {
        await fetch(url)
            .then((resp) => resp.text())
            .then((text) => {
                csv().fromString(text)
                    .then((jsonObj) => {
                        let serviceData: any = {};

                        for (const serviceEntry of jsonObj)
                            serviceData[serviceEntry.route_short_name] = serviceEntry;

                        serviceData[''] = undefined; // Dataset contains empty entry :-/

                        AsyncStorage.setItem(key, JSON.stringify(serviceData))
                    });
            });
    }

    const response = await AsyncStorage.getItem(key).catch((e) => console.error('Failed to initialise all services.', e));

    if (!response) await setToDefault();
}


/* Fetcher Methods */

/**
 * Fetches the stop times for a given stop code. The fetched data will also be cached within the
 * local storage. If the function fails to fetch the fresh data, then the error will be propagated
 * into the `StorageResponse`. Additionally, if the requested data has been cached locally, then
 * this information will also be returned within the `StorageResponse`.
 *
 * @param stopCode: of the stop to search.
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const fetchStopData = async (stopCode: string): Promise<StorageResponse> => {
    const key = StorageKeys.cachedStops;

    try {
        // Download Stop Timetable
        const url = 'https://www.metlink.org.nz/api/v1/StopDepartures/';

        return new StorageResponse(true, null,
            await fetch(url + stopCode)
                .then((resp) => {
                    if (resp.ok) return Promise.resolve(resp.json());
                    else throw TypeError('Request returned bad response: ' + resp.statusText);
                })
                .then((data) => {
                    if (!data) throw TypeError('Could not parse response!');
                    cacheStopData(stopCode, data);
                    return data;
                })
        );
    } catch (error) {
        const json = await AsyncStorage.getItem(key)
        const cachedData = (json) ? JSON.parse(json)[stopCode] : null;

        return new StorageResponse(false, error.message, cachedData);
    }
}

/**
 * Fetches the service routes for a given service code. The fetched data will also be cached within
 * the local storage. If the function fails to fetch the fresh data, then the error will be propagated
 * into the `StorageResponse`. Additionally, if the requested data has been cached locally, then
 * this information will also be returned within the `StorageResponse`.
 *
 * @param serviceCode: of the service to search.
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const fetchServiceData = async (serviceCode: string): Promise<StorageResponse> => {
    const key = StorageKeys.cachedServices;

    try {
        // Download Service Routes
        const url = "https://www.metlink.org.nz/api/v1/ServiceMap/";

        return new StorageResponse(true, null,
            await fetch(url + serviceCode)
                .then((resp) => {
                    if (resp.ok) return Promise.resolve(resp.json());
                    else throw TypeError('Request returned bad response!');
                })
                .then((data) => {
                    if (!data) throw TypeError('Could not parse response!');
                    cacheServiceData(serviceCode, data);
                    return data;
                })
        );
    } catch (error) {
        const json = await AsyncStorage.getItem(key);
        const cachedData = (json) ? JSON.parse(json)[serviceCode] : null;

        return new StorageResponse(false, error.message, cachedData);
    }
}

/* Getter Methods */


/**
 * Gets and parses the saved stops from within the Local storage.
 *
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const getSavedStops = async () => {
    const key = StorageKeys.savedStops;

    return await AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) throw Error('No saved stops present!');
            const savedStops = JSON.parse(json);

            return new StorageResponse(true, null, savedStops);
        })
        .catch((error) => {
            initSavedStops();
            return new StorageResponse(false, error.message, null);
        });
}

/**
 * Gets and parses the saved external from within the local storage.
 *
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const getSavedServices = async () => {
    const key = StorageKeys.savedServices;

    return await AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) throw Error('No saved services present!');
            const savedServices = JSON.parse(json);

            return new StorageResponse(true, null, savedServices);
        })
        .catch((error) => {
            initSavedServices();
            return new StorageResponse(false, error.message, null);
        });
}

/**
 * Gets and parses the stop data from within the local storage.
 *
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const getAllStops = async () => {
    const key = StorageKeys.allStops;

    return await AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) throw Error('No stops present!');
            const stops = JSON.parse(json);

            return new StorageResponse(true, null, stops);
        })
        .catch((error) => {
            initStops();
            return new StorageResponse(false, error.message, null);
        });
}

/**
 * Gets and parses the service data from within the local storage.
 *
 * @return response containing success / failure as well as any relevant errors or data.
 */
export const getAllServices = async () => {
    const key = StorageKeys.allServices;

    return await AsyncStorage.getItem(key)
        .then((json) => {
            if (!json) throw Error('No services present!');
            const services = JSON.parse(json);

            return new StorageResponse(true, null, services);
        })
        .catch((error) => {
            initServices();
            return new StorageResponse(false, error.message, null);
        });
}

/* Setter Methods */

/**
 * Updates the saved stops data within the Local storage. Will also update the document within
 * Firestore if user parameter is present.
 *
 * @param savedStops: Stops to save to local storage.
 * @param user?: Optionally user reference to save in Firestore.
 */
export const setSavedStops = async (savedStops: any, user?: FirebaseAuthTypes.User) => {
    const key = StorageKeys.savedStops;

    const stringData = JSON.stringify(savedStops);

    // Update locally.
    AsyncStorage.setItem(key, stringData)
        .then(() => {
            // Update in cloud.
            if (user && user.uid) updateUserDocument(user, {savedStops: stringData});
        })
        .catch((e) => console.error('Failed to save stop data', e))
}

/**
 * Updates the saved external data within the Local storage. Will also update the document within
 * Firestore if user parameter is present.
 *
 * @param savedServices: Services to save to local storage.
 * @param user?: Optionally user reference to save in Firestore.
 */
export const setSavedServices = async (savedServices: any, user?: FirebaseAuthTypes.User) => {
    const key = StorageKeys.savedServices;

    const stringData = JSON.stringify(savedServices);

    // Update locally.
    AsyncStorage.setItem(key, stringData)
        .then(() => {
            // Sync with cloud.
            if (user && user.uid) updateUserDocument(user, {savedServices: stringData});
        })
        .catch((e) => console.error('Failed to save stop data', e))
}

/**
 * Updates a selected stops most recently cached data with some more recent data. This will be updated
 * within the browsers local storage.
 *
 * @param stopCode: of the stop to update cached data.
 * @param data: to store in the cache.
 */
export const cacheStopData = async (stopCode: string, data: any) => {
    const key = StorageKeys.cachedStops;

    AsyncStorage.getItem(key)
        .then((json) => {
            // Get or init value
            let allData: any = (json) ? JSON.parse(json) : {};
            // Update with latest times.
            allData[stopCode] = data;
            // Store new values.
            AsyncStorage.setItem(key, JSON.stringify(allData));
        })
        .catch((e) => console.error('Failed to cache stop timetable', e));
}


/**
 * Updates a selected external most recently cached data with some more recent data. This will be
 * updated within the browsers local storage.
 *
 * @param serviceCode: of the service to update cached data.
 * @param data: to store in the cache.
 */
export const cacheServiceData = async (serviceCode: string, data: any) => {
    const key = StorageKeys.cachedServices;

    AsyncStorage.getItem(key)
        .then((json) => {
            // Get or init value
            let allData: any = (json) ? JSON.parse(json) : {};
            // Update with latest route.
            allData[serviceCode] = data;
            // Store new values.
            AsyncStorage.setItem(key, JSON.stringify(allData));
        })
        .catch((e) => console.error('Failed to cache service route', e));
}

/**
 * Clears the saved stop and service data within the Local storage. Will also clear the stop and
 * service data within Firestore if the user parameter is present.
 *
 * @param user?: Optionally a user reference to update Firestore.
 */
export const clearSavedData = async (user?: FirebaseAuthTypes.User) => {
    const savedStops = [StorageKeys.savedStops, JSON.stringify([])];
    const savedServices = [StorageKeys.savedServices, JSON.stringify([])];

    AsyncStorage.multiSet([savedStops, savedServices])
        .then(() => {
            if (user && user.uid) updateUserDocument(user, {
                savedStops: JSON.stringify([]),
                savedServices: JSON.stringify([]),
            }).catch((e) => console.error('Failed to clear cloud data', e));
        })
        .catch((e) => console.error('Failed to clear cloud data', e));

    setSavedStops([]).then(() => setSavedServices([]))
    if (user && user.uid) updateUserDocument(user, {
        savedStops: JSON.stringify([]),
        savedServices: JSON.stringify([])
    }).catch((e) => console.error('Failed to clear cloud data', e));
}

/**
 * Toggles a saved stop within the saved stops in Local storage. Will add the stopCode to the saved
 * stops list if it isn't present, or will remove from the list otherwise. Will also update the
 * document within Firestore if user parameter is present.
 *
 * @param stopCode: Code to toggle within the Local storage.
 * @param user?: Optionally a user reference to update Firestore.
 * @return boolean: `true` if added, `false` otherwise.
 */
export const toggleSavedStop = async (stopCode: string, user?: FirebaseAuthTypes.User) => {
    return getSavedStops()
        .then((resp) => {
            let savedStops = (resp.data) ? resp.data : [];

            // Remove from saved stops.
            if (savedStops.includes(stopCode))
                savedStops.splice(savedStops.indexOf(stopCode), 1);
            // Add to saved stops.
            else
                savedStops.push(stopCode);
            // Update Storage.
            setSavedStops(savedStops);

            // Update Firestore
            if (user) updateUserDocument(user, {savedStops: JSON.stringify(savedStops)})
                .catch((e) => console.error("Couldn't backup to cloud", e))

            const respObj = {
                state: savedStops.includes(stopCode),
                savedStops: savedStops,
            }

            return new StorageResponse(true, null, respObj);
        })
        .catch((e) => new StorageResponse(false, 'Failed to toggle saved: ' + e.message, []));
}

/**
 * Toggles a saved service within the saved external in Local storage. Will add the serviceCode to
 * the saved external list if it isn't present, or will remove from the list otherwise. Will also
 * update the document within Firestore if user parameter is present.
 *
 * @param serviceCode: Code to toggle within the Local storage.
 * @param user?: Optionally a user reference to update Firestore.
 * @return boolean: `true` if added, `false` otherwise.
 */
export const toggleSavedService = async (serviceCode: string, user?: FirebaseAuthTypes.User) => {
    return getSavedServices()
        .then((resp) => {
            let savedServices = (resp.data) ? resp.data : [];

            // Remove from saved stops.
            if (savedServices.includes(serviceCode))
                savedServices.splice(savedServices.indexOf(serviceCode), 1);
            // Add to saved stops.
            else
                savedServices.push(serviceCode);
            // Update Storage.
            setSavedServices(savedServices);

            // Update Firestore
            if (user) updateUserDocument(user, {savedStops: JSON.stringify(savedServices)})
                .catch((e) => console.error("Couldn't backup to cloud", e))

            const respObj = {
                state: savedServices.includes(serviceCode),
                savedServices: savedServices,
            }

            return new StorageResponse(true, null, respObj);
        })
        .catch((e) => new StorageResponse(false, 'Failed to toggle saved: ' + e.message, []));
}

/* Firestore Syncing (Merge local and cloud storage). */

/**
 * Syncs the Local storage with the user document within firestore. This sync uses an inclusive merge
 * based approach where both lists will be joined. (Ie, even if the user cleared the code locally,
 * it will be re-synced back into local storage if it is present within the users document in firestore).
 *
 * @param user: User reference to sync with Local storage.
 */
export const syncSavedData = async (user: FirebaseAuthTypes.User | null) => {
    if (user && user.uid) getUserDocument(user).then(async (doc: any) => {
        // Merge Saved Stops
        let savedStopsSet = new Set((await getSavedStops()).data);
        if (doc && doc.savedStops)
            JSON.parse(doc.savedStops).forEach(savedStopsSet.add, savedStopsSet);

        // Merge Saved Services
        let savedServicesSet = new Set((await getSavedServices()).data);
        if (doc && doc.savedServices)
            JSON.parse(doc.savedServices).forEach(savedServicesSet.add, savedServicesSet);

        // Convert to distinct arrays.
        let savedStopsArray = Array.from(savedStopsSet);
        let savedServicesArray = Array.from(savedServicesSet);

        // Update both locations.
        await setSavedStops(savedStopsArray);
        await setSavedServices(savedServicesArray);
        await updateUserDocument(user, {
            savedStops: JSON.stringify(savedStopsArray),
            savedServices: JSON.stringify(savedServicesArray),
        })
    });
}

/**
 * Describes the return type of requests.
 */
class StorageResponse {
    public success: boolean;
    public errorMessage: string | null;
    public data: null | any;

    /**
     * Describes the return type of requests.
     *
     * @param success: `true` if successful, `false` otherwise.
     * @param errorMessage: (Optional) to notify user.
     * @param data: (Optional) the returned data.
     */
    constructor(success: boolean, errorMessage?: string | null, data?: any | null) {
        this.success = success;
        this.errorMessage = (errorMessage) ? errorMessage : null;
        this.data = (data) ? data : null;
    }
}
