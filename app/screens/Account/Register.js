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
                source={require('../../../assets/img/signin.png')}
                resizeMode='contain'
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
        height: 200,
        marginTop: 0,
        marginBottom: -30
    },
    viewForm: {
        marginRight: 40,
        marginLeft: 40,
    }
});

export default Register