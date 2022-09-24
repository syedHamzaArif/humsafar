import images from '#assets/index.js';
import ImageIcon from '#components/common/ImageIcon.js';
import Typography from '#components/common/Typography.js';
import { colors } from '#res/colors.js';
import globalStyles from '#res/global.styles.js';
import { responsiveWidth } from '#util/responsiveSizes.js';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/stepHeader.styles';

const StepHeader = ({ tabs = [], tabPressHandler = () => null, step = 1, navigation = {} }) => {
    return (
        <View style={styles.header}>
            <View style={StyleSheet.absoluteFill} >
                <Image resizeMode="contain"
                    source={tabs[step].image}
                    style={globalStyles.image} />
            </View>
            <View style={{ marginTop: useSafeAreaInsets().top }}>
                <View style={globalStyles.row} >
                    <ImageIcon
                        source={images.back}
                        onPress={navigation.goBack}
                        style={{ width: 60, height: 60 }}
                    />
                    <Typography new variant="semiBold">{tabs[step].heading}</Typography>
                </View>
                <View style={styles.headerTabsContainer}>
                    {
                        tabs.map((item, index) => {
                            let title = (item.heading.split(' '));
                            title = title[title.length - 1];
                            return (
                                <TouchableOpacity
                                    key={`tab${index}`}
                                    activeOpacity={1}
                                    onPress={tabPressHandler.bind(this, item.id)}
                                    style={styles.headerBox}>
                                    <View style={[{ marginBottom: responsiveWidth(1) }, step === index && styles.headerNumberBordered]} >
                                        <View style={styles.headerNumber} >
                                            <Typography new color={colors.newPrimary} >{item.id + 1}</Typography>
                                        </View>
                                    </View>
                                    <Typography new size={12} style={{ textTransform: 'capitalize' }}>{title}</Typography>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    );
};

export default StepHeader;
