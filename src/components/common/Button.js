import { colors } from '#res/colors';
import { height } from '#util/';
import { responsiveFontSize } from '#util/responsiveSizes';
import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Typography from './Typography';



const Button = ({
    title = 'Button',
    onPress = () => null,
    variant = 'bold',
    buttonType = 'filled',
    style = {},
    loading = false,
    disabled = false,
    textStyle = {},
    opacity = 0.9,
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={opacity}
            style={[
                buttonType === 'filled' ? styles.button : styles.outlineButton,
                style,
            ]}
            disabled={loading || disabled}>
            {loading ?
                <ActivityIndicator
                    color={textStyle?.color ?? colors.white}
                    size={24} />
                :
                <Typography variant={variant}
                    style={{
                        color: buttonType === 'filled' ? colors.white : style?.borderColor ?? colors.primary,
                        fontSize: responsiveFontSize(2),
                        ...textStyle,
                    }}
                >
                    {title}
                </Typography>
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: width * 0.9,
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
        backgroundColor: colors.primary,
    },
    outlineButton: {
        justifyContent: 'center',
        alignItems: 'center',
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
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.white,
    },
});

export default Button;
