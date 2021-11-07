import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading';
import { resetPassword } from '../../utils/api';
import { validateEmail } from '../../utils/validations';

const RecoverPassword = (props) => {

    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const toastRef = useRef();

    const onSubmit = async () => {
        setErrorEmail(null);
        if (!validateEmail(email)) {
            setErrorEmail('Email invalido');
        } else {
            setisLoading(true);
            const result = await resetPassword(email);
            setisLoading(false);

            if (!result.statusResponse) {
                setisLoading(false);
                toastRef.current.show('No existe ningún  usuario con este email', 2500);
            }

            Alert.alert('Ok', `Se le han enviado las instrucciones a ${email}`);
            navigation.navigate('account', { screen: 'login-stack' });
        }
    }


    return (
        <View style={styles.formContainer} >
            <Image
                source={require('../../../assets/img/recovery-password.png')}
                resizeMode='contain'
                style={styles.logo}
            />
            <Input
                placeholder='Ingresa tu email...'
                containerStyle={styles.inputForm}
                onChangeText={(email) => setEmail(email)}
                defaultValue={email}
                errorMessage={errorEmail}
                keyboardType='email-address'
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Button
                title='Recuperar contraseña'
                containerStyle={styles.btnContainerRecover}
                buttonStyle={styles.btnRecover}
                onPress={onSubmit}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={isLoading} text='Recuperando Contraseña' />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 0,
    },
    logo: {
        width: '100%',
        height: 280,
    },
    inputForm: {
        width: '80%',
    },
    btnContainerRecover: {
        marginTop: 20,
        width: '85%',
        alignSelf: 'center',
    },
    btnRecover: {
        backgroundColor: '#00a680',
    },
    iconRight: {
        color: '#c1c1c1',
    }
})

export default RecoverPassword;
