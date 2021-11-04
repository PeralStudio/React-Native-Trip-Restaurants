import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { SearchBar, ListItem, Icon, Avatar } from 'react-native-elements';
import { FireSQL } from 'firesql'
import firebase from "firebase/app";


const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' });

const Search = (props) => {

    const { navigation } = props;
    const [search, setSearch] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if (search) {
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then((response) => {
                    setRestaurants(response);
                })
        }

    }, [search])

    return (
        <View>
            <SearchBar
                placeholder='Buscar restaurante...'
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 ? (
                <NotFoundRestaurants />
            ) : (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) =>
                        <Restaurant
                            restaurant={restaurant}
                            navigation={navigation}
                        />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    )
}

const Restaurant = (props) => {
    const { restaurant, navigation } = props;
    const { id, name, images } = restaurant.item;

    return (
        <ListItem
            bottomDivider
            onPress={() => navigation.navigate("restaurants", {
                screen: "restaurant-stack",
                params: { id, name },
            })}
        >
            <Avatar
                source={
                    images[0] ? { uri: images[0] } : require('../../assets/img/no-image.png')
                }
                size={50}
                rounded
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron size={30} color='black' />
        </ListItem>
    )
}

const NotFoundRestaurants = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
                source={require('../../assets/img/no-result-found.png')}
                resizeMode='cover'
                style={{ width: 200, height: 200 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
    }
})

export default Search