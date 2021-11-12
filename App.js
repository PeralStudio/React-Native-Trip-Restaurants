import React from "react";
import Navigation from "./app/navigations/Navigation";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
    return <Navigation />;
}
