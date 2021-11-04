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
                }}
            />
            <Stack.Screen
                name="add-restaurants-stack"
                component={AddRestaurants}
                options={{
                    title: 'Añadir restaurante'
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
                }}
            />
        </Stack.Navigator>
    )
}

export default RestaurantsStack