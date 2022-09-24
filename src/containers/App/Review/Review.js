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

const Review = ({
    navigation: { goBack },
    route: { params: { reviewParams: reviewParamData, reviewId, submitHandler } },
}) => {

    const [reviewState, setReviewState] = useState({});
    const [loading, setLoading] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewParams, setReviewParams] = useState(reviewParamData);

    const submitPressHandler = async () => {
        submitHandler({ reviewText, reviewParams });
        goBack();
    };

    const setReviewData = (name, value) => {
        if (name === 'review') {
            return setReviewText(value);
        } else {
            // name is index here
            const updatedParams = [...reviewParams];
            const updatedParamsItem = { ...updatedParams[name] };
            updatedParamsItem.rating = value;
            updatedParams[name] = updatedParamsItem;
            setReviewParams(updatedParams);
        }
    };

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
        if (reviewId) {
            getReview(reviewId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.root} style={styles.scroll} >
            {loading && <Loader />}
            <View style={{ width: width * 0.8, marginTop: responsiveHeight(2) }}>
                {
                    reviewId && reviewState.ratings ?
                        reviewState.ratings.map((item, index) => (
                            <View key={`rating${index}`} style={styles.row}>
                                <Typography variant="semiBold" style={{ flex: 1, textAlign: 'center' }}>{item.review_param}</Typography>
                                <View style={styles.ratingView}>
                                    <AirbnbRating
                                        isDisabled
                                        defaultRating={item.rating}
                                        showRating={false}
                                        size={20}
                                        // starStyle={{ tintColor: colors.gray }}
                                        selectedColor={colors.primary}
                                    />
                                </View>
                            </View>
                        ))
                        :
                        reviewParams.map((param, index) => {
                            return (
                                <View key={`param${index}`} style={styles.row}>
                                    <Typography variant="semiBold" style={{ flex: 1, textAlign: 'center' }}>{param.review_param}</Typography>
                                    <View style={styles.ratingView}>
                                        <AirbnbRating
                                            defaultRating={param.rating ?? 0}
                                            showRating={false}
                                            size={20}
                                            onFinishRating={setReviewData.bind(this, index)}
                                            // starStyle={{ tintColor: colors.gray }}
                                            selectedColor={colors.primary}
                                        />
                                    </View>
                                </View>
                            );
                        })
                }
                <Typography variant="semiBold" style={{ marginVertical: 10 }}>Review</Typography>
                <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                    <TextInput
                        style={styles.input}
                        textAlignVertical={'top'}
                        value={reviewId ? reviewState.review : reviewText.review}
                        onChangeText={setReviewData.bind(this, 'review')}
                        placeholder="Describe your experience here"
                        multiline
                        numberOfLines={13}
                        editable={!reviewId}
                    />
                </View>

                {
                    reviewId ? <View style={{ marginTop: height * 0.02 }} /> :
                        <Button
                            title="Submit Review"
                            onPress={submitPressHandler}
                            style={{ width: width * 0.7, alignSelf: 'center', backgroundColor: colors.secondary, marginTop: height * 0.02 }}
                            textStyle={{ color: colors.white }}
                        />
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white,
        overflow: 'hidden',
        alignItems: 'center',
        padding: responsiveWidth(2),
        borderWidth: 0.6,
        borderColor: colors.white,
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
    input: {
        paddingHorizontal: 10,
        maxHeight: height * 0.4,
        minHeight: height * 0.3,
        fontFamily: getFonts().regular,
        borderWidth: 0.6,
        borderColor: colors.primary,
        borderRadius: 8,
    },
});

export default Review;
