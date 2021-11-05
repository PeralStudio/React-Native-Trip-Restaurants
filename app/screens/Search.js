import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { SearchBar, ListItem, Icon, Avatar, Rating } from 'react-native-elements';
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
    const { id, name, images, rating, quantityVoting } = restaurant.item;

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
                size={60}
                rounded
            />
            <ListItem.Content>
                <ListItem.Title >
                    <Text style={styles.textName}>{name}</Text>
                </ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>
                    <Rating
                        imageSize={18}
                        startingValue={rating}
                        readonly
                    />
                    <View>
                        <Text style={styles.textQuantityVoting}> ({quantityVoting})</Text>
                    </View>
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron size={30} color='black' />
        </ListItem>
    )
}

const NotFoundRestaurants = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
                source={require('../../assets/img/no-results.png')}
                resizeMode='contain'
                style={{ width: 260, height: 200 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    textName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchBar: {
        marginBottom: 10,
    },
    subtitle: {
        marginTop: 5
    },
    textQuantityVoting: {
        textAlignVertical: 'bottom'
    }
})

export default Search