import React from 'react'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'


const Map = (props) => {

    const { location, name, height } = props;

    const openAppMap = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
        });
    };

    return (
        <MapView
            style={{ height: height, width: "100%" }}
            initialRegion={location}
        // onPress={openAppMap}
        >
            <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
            />
        </MapView>
    );
}

export default Map;