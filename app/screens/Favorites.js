import React, { useState, useRef, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/core";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const Favorites = (props) => {
    const { navigation } = props;
    const [restaurants, setRestaurants] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef();

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                    .where("idUser", "==", idUser)
                    .get()
                    .then((response) => {
                        const idRestaurantsArray = [];
                        response.forEach((doc) => {
                            idRestaurantsArray.push(doc.data().idRestaurant);
                        });
                        getDataRestaurant(idRestaurantsArray).then(
                            (response) => {
                                const restaurants = [];
                                response.forEach((doc) => {
                                    const restaurant = doc.data();
                                    restaurant.id = doc.id;
                                    restaurants.push(restaurant);
                                });
                                setRestaurants(restaurants);
                            }
                        );
                    });
            }
            setReloadData(false);
        }, [userLogged, reloadData])
    );

    const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection("restaurants").doc(idRestaurant).get();
            arrayRestaurants.push(result);
        });
        return Promise.all(arrayRestaurants);
    };

    if (!userLogged) {
        return <UserNoLogged navigation={navigation} />;
    }

    if (restaurants?.length === 0) {
        return <NotFoundRestaurant />;
    }

    return (
        <View style={styles.viewBody}>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant
                            restaurant={restaurant}
                            setIsLoading={setIsLoading}
                            toastRef={toastRef}
                            setReloadData={setReloadData}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" color="#00a680" />
                    <Text style={{ textAlign: "center" }}>
                        Cargando restaurantes
                    </Text>
                </View>
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Eliminando restaurante" />
        </View>
    );
};

const NotFoundRestaurant = () => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Icon
                type="material-community"
                name="silverware-fork-knife"
                size={100}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
                No tienes restaurantes favoritos
            </Text>
        </View>
    );
};

const UserNoLogged = (props) => {
    const { navigation } = props;

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                Necesitas estar logueado para ver esta sección
            </Text>
            <Button
                title="Iniciar Sesión"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#00a680" }}
                onPress={() =>
                    navigation.navigate("account", { screen: "login-stack" })
                }
            />
            <CreateAccount navigation={navigation} />
        </View>
    );
};

const CreateAccount = (props) => {
    const { navigation } = props;

    return (
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{' '}
            <Text
                style={styles.btnRegister}
                onPress={() =>
                    navigation.navigate("account", { screen: "register-stack" })}>
                Registrate
            </Text>
        </Text>
    )
}

const Restaurant = (props) => {
    const { restaurant, setIsLoading, toastRef, setReloadData, navigation } =
        props;
    const { id, name, images } = restaurant.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar restaurante de favorito",
            "¿Estas seguro que quieres eliminar este restaurante de tus favoritos?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite,
                },
            ],
            { cancelable: false }
        );
    };

    const removeFavorite = () => {
        setIsLoading(true);
        db.collection("favorites")
            .where("idRestaurant", "==", id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const idFavorite = doc.id;
                    db.collection("favorites")
                        .doc(idFavorite)
                        .delete()
                        .then(() => {
                            setIsLoading(false);
                            setReloadData(true);
                            toastRef.current.show(
                                "Restaurante eliminado correctamente"
                            );
                        })
                        .catch(() => {
                            setIsLoading(false);
                            toastRef.current.show(
                                "Error al eliminar el restaurante"
                            );
                        });
                });
            });
    };

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("restaurants", {
                        screen: "restaurant-stack",
                        params: { id, name },
                    })
                }
            >
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={
                        <ActivityIndicator size="large" color="#00a680" />
                    }
                    source={
                        images[0]
                            ? { uri: images[0] }
                            : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        size={30}
                        containerStyle={styles.favorite}
                        onPress={confirmRemoveFavorite}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
    },
    restaurant: {
        margin: 10,
    },
    image: {
        width: "100%",
        height: 180,
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
    },
    name: {
        fontWeight: "bold",
        fontSize: 30,
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 100,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: '#00a680',
        fontWeight: 'bold'
    },
});

export default Favorites;
