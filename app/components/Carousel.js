import { size } from "lodash";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";

const CarouselImage = (props) => {
    const { arrayImages, height, width, activeSlide, setActiveSlide } = props;

    const renderItem = ({ item }) => {
        return <Image style={{ width, height }} source={{ uri: item }} />;
    };

    return (
        <View>
            <Carousel
                layout={"default"}
                data={arrayImages}
                sliderWidth={width}
                itemWidth={width}
                renderItem={renderItem}
                onSnapToItem={(index) => {
                    setActiveSlide(index);
                }}
            />
            <MyPagination arrayImages={arrayImages} activeSlide={activeSlide} />
        </View>
    );
};

const MyPagination = (props) => {
    const { arrayImages, activeSlide } = props;

    return (
        <Pagination
            dotsLength={size(arrayImages)}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDotActive}
            inactiveDotStyle={styles.paginationDotInactive}
            inactiveDotOpacity={0.9}
            inactiveDotScale={0.6}
        />
    );
};

const styles = StyleSheet.create({
    paginationContainer: {
        backgroundColor: "transparent",
        zIndex: 1,
        position: "absolute",
        bottom: -20,
        alignSelf: "center",
    },
    paginationDotActive: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: "#00a680",
    },
    paginationDotInactive: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginHorizontal: 5,
        backgroundColor: "white",
    },
});

export default CarouselImage;
