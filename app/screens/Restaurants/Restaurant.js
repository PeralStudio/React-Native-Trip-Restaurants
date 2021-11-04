import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import { map } from "lodash";
import { Icon, ListItem, Rating } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import Listreviews from "../../components/Restaurants/ListReviews";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const Restaurant = (props) => {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    navigation.setOptions({
        title: name,
    });

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

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
            db.collection('favorites')
                .where('idRestaurant', '==', restaurant.id)
                .where('idUser', '==', firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if (response.docs.length === 1) {
                        setIsFavorite(true);
                    }
                })
        }
    }, [userLogged, restaurant])

    const addFavorite = () => {
        if (!userLogged) {
            toastRef.current.show('Debes estar registrado para añadir a favoritos este restaurante');
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }
            db.collection('favorites')
                .add(payload)
                .then(() => {
                    setIsFavorite(true);
                    toastRef.current.show('Restaurante añadido a favoritos');
                })
                .catch(() => {
                    toastRef.current.show('Error al añadir el restaurante a favoritos');
                })
        }
    }

    const removeFavorite = () => {
        db.collection('favorites')
            .where('idRestaurant', '==', restaurant.id)
            .where('idUser', '==', firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const idfavorite = doc.id;
                    db.collection('favorites')
                        .doc(idfavorite)
                        .delete()
                        .then(() => {
                            setIsFavorite(false);
                            toastRef.current.show('Restaurante eliminado de favoritos');
                        })
                        .catch(() => {
                            toastRef.current.show('Error al eliminar restaurante de favoritos')
                        })

                })
            })
    }

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type='material-community'
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? '#f00' : '#000'}
                    size={35}
                    underlayColor='transparent'
                />
            </View>
            <Carousel
                arrayImages={restaurant.images}
                height={200}
                width={screenWidth}
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
            />
            <Listreviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
        </ScrollView>
    );
};

const TitleRestaurant = (props) => {
    const { name, description, rating, quantityVoting } = props;

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={26}
                    readonly
                    startingValue={parseFloat(rating)}
                />
                <Text style={{ position: 'absolute', right: 0, top: 15 }}>({quantityVoting})</Text>
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

const RestaurantInfo = (props) => {
    const { location, name, address } = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: "111 222 333",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "info@peralstudio.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        },
    ];

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <Map
                location={location}
                name={name}
                height={100}
            />
            {map(listInfo, (item, index) => (
                <ListItem key={index} bottomDivider style={{ textAlignVertical: 'center' }}>
                    <Icon name={item.iconName} type={item.iconType} color='#00a680' />
                    <ListItem.Content >
                        <ListItem.Title>{item.text}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: '#fff'
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 200
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: 'grey',
    },
    rating: {
        position: 'absolute',
        right: 0,
        top: -10
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 15,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerListItem: {
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 2,
    },
    viewFavorite: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 100,
        paddingLeft: 15,
        padding: 5
    }
});

export default Restaurant;
