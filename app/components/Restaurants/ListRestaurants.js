import React from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/core";

const ListRestaurants = (props) => {
    const { restaurants, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();

    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant
                            restaurant={restaurant}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style={[styles.loaderRestaurants]}>
                    <ActivityIndicator size="large" color="#00a680" />
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    );
};

const Restaurant = (props) => {
    const { restaurant, navigation } = props;
    const { id, images, name, description, address } = restaurant.item;
    const imageRestaurant = images[images?.length - 1];

    const goRestaurant = () => {
        navigation.navigate('restaurant-stack', {
            id,
            name,
        });
    };

    return (
        <TouchableOpacity onPress={goRestaurant}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={
                            imageRestaurant
                                ? { uri: imageRestaurant }
                                : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageRestaurant}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address.substr(0, 60)}</Text>
                    <Text style={styles.restaurantDescription}>
                        {description.substr(0, 60)}...
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const FooterList = (props) => {
    const { isLoading } = props;

    if (isLoading) {
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" color="#00a680" />
            </View>
        );
    } else {
        return (
            <View style={styles.notFoundrestaurants}>
                <View style={styles.lineStyle} />
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 100,
        marginBottom: 10,
        alignItems: "center",
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10,
    },
    viewRestaurantImage: {
        marginRight: 15,
    },
    imageRestaurant: {
        width: 90,
        height: 90,
        borderRadius: 5,
    },
    textContainer: {
        justifyContent: "center",
    },
    lineStyle: {
        borderWidth: 1,
        borderColor: '#00a685',
        margin: 10,
        width: '80%'
    },
    restaurantName: {
        fontWeight: "bold",
        width: 220
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey",
        width: 240,
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 240,
        fontWeight: 'bold',
    },
    notFoundrestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
});

export default ListRestaurants;
