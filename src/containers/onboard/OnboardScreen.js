/* eslint-disable no-unused-vars */
// import Typography from 'src/components/Typography';
import images from '#assets/';
import {colors} from '#res/colors';
import {height, width} from '#util/';
// import { height, width } from 'src/util/index';
// import images from 'src/assets/index';
import React from 'react';
import {View, StyleSheet, TouchableHighlight, Image, Text} from 'react-native';

const OnboardScreen = ({data}) => {
  return (
    <TouchableHighlight underlayColor="#ffffff00" style={styles.root}>
      <>
        <View style={StyleSheet.absoluteFill}>
          <Image source={data.image} resizeMode="cover" style={styles.image} />
        </View>
        <View style={styles.descriptionView}>
          <Text
            style={{
              ...styles.descriptionText,
              marginVertical: 20,
              color: 'white',
              fontSize: 24,
            }}>
            {data.title}
          </Text>
          <Text style={styles.descriptionText}>{data.desc}</Text>
        </View>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  imageView: {
    width: width * 0.8,
    height: height * 0.35,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  descriptionView: {
    marginBottom: height * 0.2,
  },
  descriptionText: {
    width: width * 0.8,
    textAlign: 'center',
    color: 'white',
  },
});

export default OnboardScreen;
