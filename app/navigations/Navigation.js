import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements/dist/icons/Icon";

import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: "#00a680",
                    tabBarInactiveTintColor: "#646464",
                    tabBarHideOnKeyboard: true,
                })}
            >
                <Tab.Screen
                    name="restaurants"
                    component={RestaurantsStack}
                    options={{
                        headerShown: false,
                        title: "Restaurantes",
                    }}
                />
                <Tab.Screen
                    name="favorites"
                    component={FavoritesStack}
                    options={{
                        headerShown: false,
                        title: "Favoritos",
                    }}
                />
                <Tab.Screen
                    name="top-restaurants"
                    component={TopRestaurantsStack}
                    options={{
                        headerShown: false,
                        title: "Top",
                    }}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{
                        headerShown: false,
                        title: "Buscar",
                    }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{
                        headerShown: false,
                        title: "Cuenta",
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const screenOptions = (route, color) => {
    let iconName;

    switch (route.name) {
        case "restaurants":
            iconName = "compass-outline";
            break;
        case "favorites":
            iconName = "heart-outline";
            break;
        case "top-restaurants":
            iconName = "star-outline";
            break;
        case "search":
            iconName = "magnify";
            break;
        case "account":
            iconName = "home-outline";
            break;

        default:
            break;
    }
    return (
        <Icon
            type="material-community"
            name={iconName}
            size={28}
            color={color}
        />
    );
};

export default Navigation;
