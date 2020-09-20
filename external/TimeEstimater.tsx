import Geolocation from "@react-native-community/geolocation";

export const getEstimatedWalkTime = async (stopInfo: any, setTime: (time: number) => void) => {
    if (!stopInfo || !setTime) return;

    Geolocation.getCurrentPosition(successfulPosition)

    function successfulPosition(position: any){
        if (!position?.coords?.latitude) return;

        let lat1 = stopInfo.stop_lat;
        let lat2 = position.coords.latitude;
        let lon1 = stopInfo.stop_lon;
        let lon2 = position.coords.longitude;

        let R = 6378.137; // Radius of earth in KM
        let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        setTime(Math.round((d * 14) + 1));
    }
}


