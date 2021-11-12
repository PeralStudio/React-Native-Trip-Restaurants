import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const AddReviewRestaurant = (props) => {
    const { navigation, route } = props;
    const { idRestaurant } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () => {
        if (!rating) {
            toastRef.current.show("No has dado ninguna puntuación");
        } else if (!title) {
            toastRef.current.show("El título es obligatorio");
        } else if (!review) {
            toastRef.current.show("El comentario es obligatorio");
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title,
                review,
                rating,
                createdAt: new Date(),
            };

            db.collection("reviews")
                .add(payload)
                .then(() => {
                    updateRestaurant();
                })
                .catch(() => {
                    toastRef.current.show("Error al enviar la review");
                    setIsLoading(false);
                });
        }
    };

    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then((response) => {
            const restaurantData = response.data();
            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoting = restaurantData.quantityVoting + 1;
            const ratingResult = ratingTotal / quantityVoting;

            restaurantRef
                .update({
                    rating: ratingResult,
                    ratingTotal,
                    quantityVoting,
                })
                .then(() => {
                    setIsLoading(false);
                    navigation.navigate("restaurants-stack");
                });
        });
    };

    return (
        <ScrollView style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={[
                        "Pésimo",
                        "Deficiente",
                        "Normal",
                        "Muy Bueno",
                        "Excelente",
                    ]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Título"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Comentario..."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando Comentario" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2",
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 150,
        width: "auto",
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        marginTop: 30,
        backgroundColor: "#00a680",
    },
});

export default AddReviewRestaurant;
