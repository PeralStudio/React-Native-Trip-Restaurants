import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'

const UserGuest = () => {

    const navigation = useNavigation();

    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image
                source={require('../../../assets/img/user-guest.jpg')}
                resizeMode='contain'
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de Restaurantes</Text>
            <Text style={styles.description}>¿Como describirias tu mejor restaurante? Busca y visualiza los mejores Restaurantes de una forma sencilla, vota por el que mas te haya gustado y comenta tu experiencia.</Text>
            <View style={styles.viewBtn}>
                <Button
                    title='Ver tu Perfil'
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('login-stack')}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: '100%',
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    },
    btnStyle: {
        backgroundColor: '#00a680'
    },
    btnContainer: {
        width: '70%'
    }
})

export default UserGuest