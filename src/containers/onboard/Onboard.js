/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
// import Button from 'src/components/Button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import OnboardScreen from './OnboardScreen';
import images from '#assets/index';
import { AuthContext } from '#context/';
import { colors } from '#res/colors';
import { width, height } from '#util/';

const data = [
  {
    id: 0,
    // title: 'Welcome Pakistan',
    // desc: 'Order the finest Fast food in your locality in just a few taps.',
    image: images.onboard1,
  },
  {
    id: 1,
    // title: 'Welcome Pakistan',
    // desc: 'We offer supreme quality, full of variety and hygienic meal.',
    image: images.onboard2,
  },
  {
    id: 2,
    // title: 'Welcome Pakistan',
    // desc: 'Pizza Palace is here to fulfil your Fast Food cravings.',
    image: images.onboard3,
  },
];

const Onboard = (props) => {
  const [step, setStep] = useState(0);
  const carouselRef = useRef(null);
  const { onboard } = useContext(AuthContext);

  const _renderItem = ({ item }) => {
    return <OnboardScreen data={item} />;
  };

  const handleGetStarted = () => {

    autoNext(true);
    onboard();
  };

  var timer;
  const autoNext = (exit) => {
    if (exit) {
      clearTimeout(timer);
      return;
    }
    timer = setTimeout(() => {
      if (step === 2) {
        onboard();
        return;
      } else {
        setStep(step + 1);
        carouselRef.current.snapToNext();
      }
    }, 3000);
  };

  useEffect(() => {
    autoNext();
    return () => {
      autoNext(true);
    };
  }, [step]);
  {
    /* <Button onPress={handleGetStarted} title="Get Started" /> */
  }

  const Next = () => {

    carouselRef.current.snapToNext();
  };

  return (
    <View style={styles.root}>
      {/* <View style={{backgroundColor: 'red', zIndex: 1}}> */}
      <TouchableOpacity
        hitSlop={{ left: 50, right: 50, top: 50, bottom: 50 }}
        style={styles.skipbutton}
        onPress={handleGetStarted}
        activeOpacity={0.9}>
        <Text style={styles.skiptxt}>Skip</Text>
      </TouchableOpacity>
      {/* </View> */}
      <View style={styles.onBoardView}>
        <Carousel
          ref={carouselRef}
          scrollToOverflowEnabled
          data={data}
          renderItem={_renderItem}
          // scrollEnabled={false}
          onSnapToItem={(index) => setStep(index)}
          sliderWidth={useWindowDimensions().width}
          itemWidth={useWindowDimensions().width}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Pagination
          dotsLength={data.length}
          activeDotIndex={step}
          dotColor={colors.PRIMARY}
          inactiveDotColor={'white'}
          inactiveDotOpacity={10}
          dotContainerStyle={{ marginHorizontal: 4 }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={Next}
          activeOpacity={0.9}>
          <Text style={styles.txtNext}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: colors.white,
    // justifyContent: 'flex-end',
    alignItems: 'center',
  },
  onBoardView: {
    // flex: 1,
    ...StyleSheet.absoluteFill,
    // height: maxHeight * 0.7 ,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  actionImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '30%',
    opacity: 0.3,
  },
  logo2: {
    width: 100,
    height: 150,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: 12,
    alignItems: 'center',
    marginTop: height * 0.68,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 18,
    height: 18,
    borderRadius: 8,
    opacity: 1,
    backgroundColor: colors.textSecondary,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.065,
    margin: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 8,
    flexDirection: 'row',
    // backgroundColor: colors.primary,
    backgroundColor: colors.PRIMARY,
    // marginBottom: height * 0.1,
  },
  txtNext: {
    color: 'black',
    fontWeight: 'bold',
  },
  skipbutton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: width * 0.2,
    margin: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 6,
    // backgroundColor: colors.primary,
    backgroundColor: colors.PRIMARY,
    zIndex: 1,
  },
  skiptxt: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Onboard;
