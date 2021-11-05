import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TopRestaurants from '../screens/TopRestaurants';

const Stack = createNativeStackNavigator();

const TopRestaurantsStack = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="top-restaurants-stack"
                component={TopRestaurants}
                options={{
                    title: 'Los Mejores Restaurantes',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
        </Stack.Navigator>
    )
}

export default TopRestaurantsStack