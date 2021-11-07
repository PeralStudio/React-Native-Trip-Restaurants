import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Avatar, Rating, Icon } from "react-native-elements";
import { map } from 'lodash';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

const Listreviews = (props) => {
    const { navigation, idRestaurant } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useEffect(() => {
        db.collection('reviews')
            .where('idRestaurant', '==', idRestaurant)
            .get()
            .then((response) => {
                const resultReview = [];
                response.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    resultReview.push(data);
                });
                setReviews(resultReview)
            });
    }, [])

    return (
        <View>
            {userLogged ? (
                <Button
                    title="Escribe una opinión"
                    type="outline"
                    color="#00a680"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    icon={
                        <Icon
                            type='material-community'
                            name='square-edit-outline'
                            size={15}
                            color="#00a680"
                            marginRight={5}
                        />
                    }
                    onPress={() => navigation.navigate('add-review-restaurant-stack', {
                        idRestaurant: idRestaurant,
                    })}
                />
            ) : (
                <View style={styles.container}>
                    <Text
                        style={styles.textNoLogged}
                        onPress={() =>
                            navigation.navigate("account", { screen: "account" })
                        }
                    >
                        Para valorar el restaurante debe estar logeado,{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            pulsa AQUÍ para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}

            {map(reviews, (review, index) => (
                <Review key={index} review={review} />
            ))}

        </View>
    );
};

const Review = (props) => {
    const { title, review, rating, createdAt, avatarUser } = props.review;
    const createReview = new Date(createdAt.seconds * 1000);

    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size='large'
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={avatarUser ? { uri: avatarUser } : require('../../../assets/img/avatar.jpg')}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>
                    {createReview.getDate()}/{createReview.getMonth() + 1}/{createReview.getFullYear()} - {createReview.getHours()}:{createReview.getMinutes() < 10 ? '0' : ''}{createReview.getMinutes()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    btnAddReview: {
        width: "50%",
        alignSelf: "center",
        padding: 10,
        marginBottom: 10,
        borderColor: "#00a680",
        borderWidth: 1,
        borderRadius: 50,
    },
    btnTitleAddReview: {
        color: "#00a680",
    },
    textNoLogged: {
        textAlign: "center",
        color: '#00a680',
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 20,
        marginTop: 10,
    },
    viewReview: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 30,
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1,
    },
    viewImageAvatar: {
        marginRight: 15,
    },
    imageAvatarUser: {
        width: 50,
        height: 50,
        marginTop: 5
    },
    viewInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    reviewTitle: {
        fontWeight: 'bold',
    },
    reviewText: {
        paddingTop: 2,
        color: 'grey',
        marginBottom: 5,
    },
    reviewDate: {
        marginTop: 5,
        color: 'grey',
        fontSize: 12,
        position: 'absolute',
        right: 5,
        bottom: 0
    },
});

export default Listreviews;
