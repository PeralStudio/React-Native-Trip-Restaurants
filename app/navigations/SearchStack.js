import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Search from '../screens/Search';

const Stack = createNativeStackNavigator();

const SearchStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="search-stack"
                component={Search}
                options={{
                    title: 'Buscador',
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}

export default SearchStack