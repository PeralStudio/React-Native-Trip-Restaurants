import React from 'react'
import { StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'

const Modal = (props) => {

    const { isVisible, setIsVisible, children } = props;

    const closeModal = () => setIsVisible(false);

    return (
        <Overlay
            isVisible={isVisible}
            overlayStyle={style.overlay}
            onBackdropPress={closeModal}
        >
            {children}
        </Overlay>
    )
}

const style = StyleSheet.create({
    overlay: {
        height: 'auto',
        width: '90%',
        backgroundColor: '#fff'
    }
})

export default Modal