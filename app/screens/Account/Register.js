import React, { useRef } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import Toast from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import RegisterForm from '../../components/Account/RegisterForm';


const Register = () => {

    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <Image
                source={require('../../../assets/img/icono-logo.jpg')}
                resizeMode='cover'
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef} />
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 150,
        // marginTop: 10,
        // borderRadius: 5,
    },
    viewForm: {
        marginRight: 40,
        marginLeft: 40,
    }
});

export default Register