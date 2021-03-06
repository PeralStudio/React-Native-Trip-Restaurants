import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorites from "../screens/Favorites";

const Stack = createNativeStackNavigator();

const FavoritesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="favorites-stack"
                component={Favorites}
                options={{
                    title: "Restaurantes Favoritos",
                    headerTitleAlign: "center",
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
        </Stack.Navigator>
    );
};

export default FavoritesStack;
