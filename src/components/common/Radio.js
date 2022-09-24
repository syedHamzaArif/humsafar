import { colors } from '#res/colors';
import { responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Typography from './Typography';

const Radio = ({
    label, description, selected, onPress, disabled, containerStyle,
    type = 'radio',
}) => {
    return (
        <TouchableOpacity activeOpacity={0.9} disabled={disabled}
            onPress={onPress.bind(this, !selected)}
            style={[styles.row, containerStyle]}
        >
            <Icon containerStyle={{ padding: 6 }}
                name={
                    type === 'radio' ?
                        selected ? 'md-radio-button-on' : 'md-radio-button-off' :
                        selected ? 'checkmark-circle' : 'md-radio-button-off'
                }
                color={selected ? colors.primary : colors.textPrimary}
                type="ionicon" size={20} />
            <View>
                <Typography>{label}</Typography>
                {
                    !description ? null :
                        <Typography size={10} variant="small" color={colors.buttonGray}>{description}</Typography>
                }
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: responsiveWidth(2),
    },
});

export default Radio;
