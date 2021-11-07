import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Account from '../screens/Account/Account';
import Login from '../screens/Account/Login';
import Register from '../screens/Account/Register';
import Recoverpassword from '../screens/Account/RecoverPassword';

const Stack = createNativeStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account-stack"
                component={Account}
                options={{
                    title: 'Mi Cuenta',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
            <Stack.Screen
                name="login-stack"
                component={Login}
                options={{
                    title: 'Iniciar Sesión',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
            <Stack.Screen
                name="register-stack"
                component={Register}
                options={{
                    title: 'Registro',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
            <Stack.Screen
                name="recover-password-stack"
                component={Recoverpassword}
                options={{
                    title: 'Recuperar Contraseña',
                    headerTitleAlign: 'center',
                    // headerStyle: { backgroundColor: '#00a680' },
                }}
            />
        </Stack.Navigator>
    )
}

export default AccountStack;