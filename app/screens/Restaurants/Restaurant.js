import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    Linking,
} from "react-native";
import { map } from "lodash";
import { Icon, ListItem, Rating } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import CarouselImage from "../../components/Carousel";
import Map from "../../components/Map";
import openMap from "react-native-open-maps";
import Listreviews from "../../components/Restaurants/ListReviews";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

const Restaurant = (props) => {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const toastRef = useRef();

    navigation.setOptions({
        title: name,
        // headerStyle: { backgroundColor: '' },
    });

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id)
                .get()
                .then((response) => {
                    const data = response.data();
                    data.id = response.id;
                    setRestaurant(data);
                    setRating(data.rating);
                });
        }, [])
    );

    useEffect(() => {
        if (userLogged && restaurant) {
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if (response.docs.length === 1) {
                        setIsFavorite(true);
                    }
                });
        }
    }, [userLogged, restaurant]);

    const addFavorite = () => {
        if (!userLogged) {
            toastRef.current.show(
                "Debes estar registrado para añadir a favoritos este restaurante"
            );
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id,
            };
            db.collection("favorites")
                .add(payload)
                .then(() => {
                    setIsFavorite(true);
                    toastRef.current.show("Restaurante añadido a favoritos");
                })
                .catch(() => {
                    toastRef.current.show(
                        "Error al añadir el restaurante a favoritos"
                    );
                });
        }
    };

    const removeFavorite = () => {
        db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const idfavorite = doc.id;
                    db.collection("favorites")
                        .doc(idfavorite)
                        .delete()
                        .then(() => {
                            setIsFavorite(false);
                            toastRef.current.show(
                                "Restaurante eliminado de favoritos"
                            );
                        })
                        .catch(() => {
                            toastRef.current.show(
                                "Error al eliminar restaurante de favoritos"
                            );
                        });
                });
            });
    };

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <CarouselImage
                arrayImages={restaurant.images}
                height={200}
                width={screenWidth}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
                quantityVoting={restaurant.quantityVoting}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
                phone={restaurant.phone}
                email={restaurant.email}
            />
            <Listreviews navigation={navigation} idRestaurant={restaurant.id} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
};

const TitleRestaurant = (props) => {
    const { name, description, rating, quantityVoting } = props;

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={22}
                    readonly
                    startingValue={parseFloat(rating)}
                />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ marginLeft: 5, fontSize: 16 }}>
                        ({quantityVoting})
                    </Text>
                </View>
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    );
};

const phoneCall = (phone) => Linking.openURL(`tel:${phone}`);

const sendEmail = (to) => Linking.openURL(`mailto:${to}`);

const openAppMap = (location, address, name) => {
    openMap({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 18,
        end: address,
        query: name,
    });
};

const RestaurantInfo = (props) => {
    const { location, name, address, phone, email } = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: () => openAppMap(location, address, name),
        },
        {
            text: phone,
            iconName: "phone-in-talk",
            iconType: "material-community",
            action: () => phoneCall(phone),
        },
        {
            text: email,
            iconName: "email-plus",
            iconType: "material-community",
            action: () => sendEmail(email),
        },
    ];

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <View style={{ marginBottom: 15 }}>
                <Map
                    location={location}
                    name={name}
                    address={address}
                    height={100}
                />
            </View>
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    bottomDivider
                    style={{
                        textAlignVertical: "center",
                        marginRight: -10,
                        marginLeft: -10,
                    }}
                    onPress={item.action}
                >
                    <View>
                        <Icon
                            name={item.iconName}
                            type={item.iconType}
                            color="#00a680"
                            size={28}
                        />
                    </View>
                    <ListItem.Content>
                        <ListItem.Title style={{ width: "100%" }}>
                            {item.text}
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron color={"#00a680"} size={20} />
                </ListItem>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold",
        width: 195,
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey",
    },
    rating: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 2,
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        paddingLeft: 15,
        padding: 5,
    },
    viewAction: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default Restaurant;
