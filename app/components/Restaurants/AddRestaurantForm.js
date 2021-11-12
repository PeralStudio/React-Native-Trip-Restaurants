import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Avatar, Button, Icon, Image, Input } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { validateEmail, validatePhone } from "../../utils/validations";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

const AddRestaurantForm = (props) => {
    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantEmail, setRestaurantEmail] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if (
            !restaurantName ||
            !restaurantAddress ||
            !restaurantDescription ||
            !restaurantPhone ||
            !restaurantEmail
        ) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (size(imagesSelected) === 0) {
            toastRef.current.show(
                "El restaurante debe tener al menos una foto"
            );
        } else if (!locationRestaurant) {
            toastRef.current.show("Debes localizar el restaurante en el mapa");
        } else if (!validatePhone(restaurantPhone)) {
            toastRef.current.show("El teléfono no es válido");
        } else if (!validateEmail(restaurantEmail)) {
            toastRef.current.show("El Email no es válido");
        } else {
            setIsLoading(true);
            uploadImageStorage().then((response) => {
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        phone: restaurantPhone,
                        email: restaurantEmail,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createdAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurants-stack");
                    })
                    .catch(() => {
                        setIsLoading(false);
                        toastRef.current.show(
                            "Error al subir el restaurante, intentelo más tarde"
                        );
                    });
            });
        }
    };

    const uploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imagesSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );

        return imageBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imagenRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setRestaurantPhone={setRestaurantPhone}
                setRestaurantEmail={setRestaurantEmail}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    );
};

const FormAdd = (props) => {
    const {
        setRestaurantName,
        setRestaurantAddress,
        setRestaurantDescription,
        setRestaurantPhone,
        setRestaurantEmail,
        setIsVisibleMap,
        locationRestaurant,
    } = props;
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "map-search-outline",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true),
                }}
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
            <View style={styles.viewPhone}>
                <Input
                    placeholder="Telefono"
                    inputContainerStyle={styles.inputPhone}
                    keyboardType="phone-pad"
                    onChange={(e) => setRestaurantPhone(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Email"
                    inputContainerStyle={styles.inputEmail}
                    keyboardType="email-address"
                    onChange={(e) => setRestaurantEmail(e.nativeEvent.text)}
                />
            </View>
        </View>
    );
};

const Map = (props) => {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } =
        props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions =
                resultPermissions.permissions.location.status;

            if (statusPermissions !== "granted") {
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizaciónpara crear un restaurante",
                    3000
                );
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            }
        })();
    }, []);

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localización guardada correctamente");
        setIsVisibleMap(false);
    };

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location ? (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                ) : (
                    <Text style={styles.textLoadingMap}>Cargando...</Text>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    );
};

const ImageRestaurant = (props) => {
    const { imagenRestaurant } = props;

    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imagenRestaurant
                        ? { uri: imagenRestaurant }
                        : require("../../../assets/img/no-image.png")
                }
                style={{ width: widthScreen, height: 180 }}
            />
        </View>
    );
};

const UploadImage = (props) => {
    const { toastRef, imagesSelected, setImagesSelected } = props;

    const imageSelect = async () => {
        const resultPermissions =
            await ImagePicker.requestCameraPermissionsAsync();

        if (resultPermissions === "denied") {
            toastRef.current.show(
                "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir a ajustes y activarlos manualmente",
                3000
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (result.cancelled) {
                toastRef.current.show(
                    "Has cerrado la galeria sin seleccionar ninguna imagen",
                    2000
                );
            } else {
                setImagesSelected([...imagesSelected, result.uri]);
            }
        }
    };

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Esta seguro que quiere eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImagesSelected(
                            filter(
                                imagesSelected,
                                (imageUrl) => imageUrl !== image
                            )
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.viewImages}>
            {size(imagesSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imagesSelected, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    inputPhone: {
        width: "80%",
    },
    inputEmail: {
        width: "80%",
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: "center",
        height: 180,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60b0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680",
    },
});

export default AddRestaurantForm;
