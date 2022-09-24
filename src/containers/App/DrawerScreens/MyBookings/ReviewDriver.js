import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { getFonts } from '#util/index';
import { height } from '#util/';
import { width } from '#util/';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { AirbnbRating, Icon } from 'react-native-elements';
import Button from '#components/common/Button';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { Service } from '#config/service';
import Loader from '#components/common/Loader';

const ReviewDriver = ({ currentRide, loading, setLoading, submitHandler, setVisible, reviewData, setReviewData }) => {

    const [reviewState, setReviewState] = useState({});

    const reviewGiven = currentRide.reviews.length > 0;


    const getReview = async review_id => {
        try {
            setLoading(true);
            const { data } = await Service.getReview(review_id);
            setReviewState(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (currentRide?.reviews?.length) {
            getReview(currentRide.reviews[0].review_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRide.reviews]);

    return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.root} style={styles.scroll} >
            {loading && <Loader />}
            <View style={{ width: width * 0.8, marginTop: responsiveHeight(2) }}>
                {
                    reviewGiven && reviewState.ratings ?
                        reviewState.ratings.map((item, index) => (
                            <View key={`rating${index}`} style={styles.row}>
                                <Typography style={{ flex: 1, color: colors.white, textAlign: 'center' }}>{item.review_param}</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        isDisabled
                                        defaultRating={item.rating}
                                        showRating={false}
                                        size={20}
                                        onFinishRating={setReviewData.bind(this, 'experience')}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.white}
                                    />
                                </View>
                            </View>
                        ))
                        :
                        <>
                            <View style={styles.row}>
                                <Typography style={{ flex: 1, color: colors.white, textAlign: 'center' }}>Experience</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        defaultRating={reviewData.experience}
                                        showRating={false}
                                        size={20}
                                        onFinishRating={setReviewData.bind(this, 'experience')}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.white}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Typography style={{ flex: 1, color: colors.white, textAlign: 'center' }}>Driving</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        defaultRating={reviewData.driving}
                                        showRating={false}
                                        size={20}
                                        onFinishRating={setReviewData.bind(this, 'driving')}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.white}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Typography style={{ flex: 1, color: colors.white, textAlign: 'center' }}>Timeliness</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        defaultRating={reviewData.timeliness}
                                        showRating={false}
                                        size={20}
                                        onFinishRating={setReviewData.bind(this, 'timeliness')}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.white}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Typography style={{ flex: 1, color: colors.white, textAlign: 'center' }}>Cleanliness</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        defaultRating={reviewData.cleanliness}
                                        showRating={false}
                                        size={20}
                                        onFinishRating={setReviewData.bind(this, 'cleanliness')}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.white}
                                    />
                                </View>
                            </View>
                            <View />
                        </>
                }
                <Typography style={{ color: colors.white, marginVertical: 10 }}>Review</Typography>
                <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                    <TextInput
                        style={{
                            paddingHorizontal: 10,
                            maxHeight: height * 0.4,
                            minHeight: height * 0.3,
                            fontFamily: getFonts().regular,
                        }}
                        textAlignVertical={'top'}
                        value={reviewGiven ? reviewState.review : reviewData.review}
                        onChangeText={setReviewData.bind(this, 'review')}
                        placeholder="Describe your experience here"
                        multiline
                        numberOfLines={13}
                        editable={!reviewGiven}
                    />
                </View>

            </View>
            {
                reviewGiven ? <View style={{ marginTop: height * 0.02 }} /> :
                    <Button
                        title="Submit Review"
                        onPress={submitHandler}
                        style={{ width: width * 0.7, backgroundColor: colors.secondary, marginTop: height * 0.02 }}
                        textStyle={{ color: colors.white }}
                    />
            }
            <Icon name="ios-close-circle" type="ionicon" size={26}
                color={colors.white}
                onPress={() => setVisible(false)}
                containerStyle={{ position: 'absolute', right: 8, top: 8 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: colors.primary,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsiveWidth(2),
        borderRadius: 12,
        borderWidth: 0.6,
        borderColor: colors.white,
    },
    scroll: {
        marginVertical: height * 0.1,
    },
    ratingView: {
        marginVertical: 4,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveHeight(1),
    },
});

export default ReviewDriver;
