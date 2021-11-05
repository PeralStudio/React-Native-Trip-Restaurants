import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Restaurants from '../screens/Restaurants/Restaurants'
import AddRestaurants from '../screens/Restaurants/AddRestaurants';
import Restaurant from '../screens/Restaurants/Restaurant';
import AddReviewRestaurant from '../screens/Restaurants/AddReviewRestaurant';

const Stack = createNativeStackNavigator();

const RestaurantsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants-stack"
                component={Restaurants}
                options={{
                    title: 'Restaurantes',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
            <Stack.Screen
                name="add-restaurants-stack"
                component={AddRestaurants}
                options={{
                    title: 'Añadir restaurante',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
            <Stack.Screen
                name="restaurant-stack"
                component={Restaurant}
            />
            <Stack.Screen
                name="add-review-restaurant-stack"
                component={AddReviewRestaurant}
                options={{
                    title: 'Nuevo comentario',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
        </Stack.Navigator>
    )
}

export default RestaurantsStack