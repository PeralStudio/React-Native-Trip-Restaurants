import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Card, Image, Icon, Rating } from "react-native-elements";

const ListToprestaurants = (props) => {
    const { restaurants, navigation } = props;

    return (
        <FlatList
            data={restaurants}
            renderItem={(restaurant) => (
                <Restaurant restaurant={restaurant} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

const Restaurant = (props) => {
    const { restaurant, navigation } = props;
    const { id, name, rating, images, description, quantityVoting } =
        restaurant.item;
    const [iconColor, setIconColor] = useState("#000");

    useEffect(() => {
        if (restaurant.index === 0) {
            setIconColor("#efb819");
        } else if (restaurant.index === 1) {
            setIconColor("#e3e4e5");
        } else if (restaurant.index === 2) {
            setIconColor("#cd7f32");
        }
    }, []);

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("restaurants", {
                    screen: "restaurant-stack",
                    params: { id, name },
                })
            }
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={
                        images[0]
                            ? { uri: images[0] }
                            : require("../../../assets/img/no-image.png")
                    }
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating
                        style={styles.rating}
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                    <Text style={{ marginLeft: 1, marginTop: 3, fontSize: 16 }}>
                        ({quantityVoting})
                    </Text>
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 30,
        borderWidth: 0,
    },
    containerIcon: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1,
    },
    restaurantImage: {
        width: "100%",
        height: 200,
    },
    titleRating: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        width: "60%",
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify",
    },
    rating: {
        flex: 1,
        alignItems: "flex-end",
        textAlignVertical: "top",
        marginTop: 4,
    },
});

export default ListToprestaurants;
