import * as firebase from 'firebase';

export const reauthenticate = (password) => {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );
    return user.reauthenticateWithCredential(credentials);
}

export const resetPassword = async (email) => {
    const result = { statusResponse: true, error: null };

    try {
        await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
        result.statusResponse = false;
        result.error = error;
    }

    return result;
}
