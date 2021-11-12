import React, { useRef } from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import LoginForm from "../../components/Account/LoginForm";
import Toast from "react-native-easy-toast";

const Login = () => {
    const navigation = useNavigation();
    const toastRef = useRef();

    return (
        <ScrollView>
            <Image
                source={require("../../../assets/img/login.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef} />
                <RecoverPassWord navigation={navigation} />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
};

const RecoverPassWord = (props) => {
    const { navigation } = props;

    return (
        <Text
            style={styles.textRegister}
            onPress={() => navigation.navigate("recover-password-stack")}
        >
            ¿Olvidaste tu contraseña?{" "}
            <Text style={styles.btnRegister}>Recuperar Contraseña</Text>
        </Text>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        marginBottom: -40,
        height: 260,
    },
    viewContainer: {
        marginRight: 20,
        marginLeft: 20,
    },
    textRegister: {
        marginTop: 15,
        textAlign: "center",
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold",
    },
});

export default Login;
