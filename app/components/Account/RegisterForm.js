import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import Loading from '../Loading';
import { validateEmail } from '../../utils/validations';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/core';


const RegisterForm = (props) => {

    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    let inputPassword;
    let inputRepeatPassword;

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)) {
            toastRef.current.show('Todos los campos son obligatorios');
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El email no es correcto');
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show('Las contraseñas tienen que ser iguales');
        } else if (size(formData.password) < 6) {
            toastRef.current.show('La contraseña tiene que tener al menos 6 caracteres');
        } else {
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate('account-stack');
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show('El email ya esta en uso, pruebe con otro');
                })
        }
    }

    const onChange = (e, type) => {
        setFormData({
            ...formData,
            [type]: e.nativeEvent.text
        })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder='Correo electronico'
                containerStyle={styles.inputForm}
                keyboardType='email-address'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onSubmitEditing={() => inputPassword.focus()}
                onChange={(e) => onChange(e, 'email')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder='Contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onSubmitEditing={() => inputRepeatPassword.focus()}
                ref={(input) => inputPassword = input}
                onChange={(e) => onChange(e, 'password')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder='Repetir contraseña'
                containerStyle={styles.inputForm}
                password={true}
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={showRepeatPassword ? false : true}
                ref={(input) => inputRepeatPassword = input}
                onSubmitEditing={onSubmit}
                onChange={(e) => onChange(e, 'repeatPassword')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button
                title='Unirse'
                style={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading
                isVisible={loading}
                text='Creando cuenta'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    inputForm: {
        width: '100%',
        marginTop: 15,
    },
    btnContainerRegister: {
        marginTop: 10,
        width: 20
    },
    btnRegister: {
        backgroundColor: '#00a680',
        marginBottom: 10,
    },
    iconRight: {
        color: '#c1c1c1'
    }
});

export default RegisterForm