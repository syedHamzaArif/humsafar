import { colors } from '#res/colors';
import { getFonts } from '#util/index';
import { responsiveFontSize } from '#util/responsiveSizes';
import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
function Typography(props) {
    const { variant, size, lineHeight, color, align, style, numberOfLines, new: newType, flex } = props;
    const fonts = getFonts();
    let updatedStyles = {};
    if (Array.isArray(style)) {
        for (const index in style) {
            const element = style[index];
            updatedStyles = { ...updatedStyles, ...element };
        }
    } else {
        updatedStyles = style;
    }
    return (
        <Text
            style={{
                fontFamily: variant === 'regular' ? fonts.regular
                    : variant === 'small' ? fonts.light
                        : variant === 'medium' ? fonts.medium
                            : variant === 'bold' ? fonts.bold
                                : variant === 'semiBold' ? fonts.semiBold
                                    : variant === 'black' ? fonts.black
                                        : fonts.regular,
                fontSize:
                    size ? size :
                        variant === 'small' ? responsiveFontSize(1.6)
                            : variant === 'medium' ? responsiveFontSize(1.6)
                                : variant === 'regular' ? responsiveFontSize(1.8)
                                    : variant === 'semiBold' ? responsiveFontSize(1.9)
                                        : variant === 'bold' ? responsiveFontSize(2)
                                            : variant === 'black' ? responsiveFontSize(2.2) : responsiveFontSize(1.8),
                color: color ? color : newType ? colors.textPrimary : colors.newTextPrimary,
                textAlign: align ? align : 'left',
                lineHeight: lineHeight && lineHeight,
                flex: flex ? 1 : null,
                ...updatedStyles,
            }}
            numberOfLines={numberOfLines}
        >
            {props.children}
        </Text>

    );
}

Typography.prototypes = {
    // variant: PropTypes.oneOf(['small', 'medium', 'bold', 'semiBold', 'black']),
    variant: PropTypes.string,
};

// Typography.defaultProps = {
//     variant: 'regular',
// };

export default Typography;
