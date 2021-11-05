import React, { useRef } from 'react'
import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import LoginForm from '../../components/Account/LoginForm'
import Toast from 'react-native-easy-toast'


const Login = () => {

    const toastRef = useRef();

    return (
        <ScrollView>
            <Image
                source={require('../../../assets/icon.png')}
                resizeMode='contain'
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef} />
                {/* <CreateAccount /> */}
            </View>
            {/* <Divider style={styles.divider} /> */}
            <Toast ref={toastRef} position='center' opacity={0.9} />
        </ScrollView>
    )
}

const CreateAccount = () => {

    const navigation = useNavigation();

    return (
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{' '}
            <Text
                style={styles.btnRegister}
                onPress={() => navigation.navigate('register-stack')}>
                Registrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 160,
        marginTop: 20,
        borderRadius: 5,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: '#00a680',
        fontWeight: 'bold'
    },
    divider: {
        backgroundColor: '#00a680',
        margin: 25,
        height: 2
    }
})

export default Login