import React, { useState } from 'react';
import { Input, Icon } from 'react-native-elements';
import { TouchableOpacity, View } from 'react-native';
import { height } from '#util/';
import Typography from './Typography';
import { colors } from '#res/colors';
import { getFonts } from '#util/index';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';


function InputComponent(props, ref) {
    let inputElement = null;

    const [hide, setHide] = useState(true);
    switch (props.elementType) {
        case ('input'):
            inputElement =
                props.visible ?
                    <View>
                        {props.headerMessage ? <Typography color={colors.newPrimary}
                            style={{
                                marginBottom: 5,
                                paddingLeft: 10,
                            }}>
                            {props.headerMessage}
                        </Typography> : null
                        }
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}>
                            <Input
                                ref={ref}
                                errorMessage={props.showError && !props.isValid ? props.errorMessage : ''}
                                errorStyle={{
                                    color: colors.warning,
                                    fontFamily: getFonts().semiBold,
                                    fontSize: 11,
                                }}
                                leftIcon={props.leftIcon}
                                placeholderTextColor={colors.newSecondary + '99'}
                                {...props.elementConfig}
                                value={props.value}
                                onChangeText={props.change}
                                blurOnSubmit={props.elementConfig.blurOnSubmit ?? false}
                                containerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={{
                                    padding: 0,
                                    paddingLeft: 10,
                                    fontSize: 13,
                                    fontFamily: getFonts().regular,
                                    color: colors.newSecondary,
                                    // ...props.inputStyle,
                                }}
                                returnKeyType={props.elementConfig.blurOnSubmit ? 'done' : 'next'}
                                inputContainerStyle={{
                                    borderColor: props.showError && !props.isValid ? colors.warning : colors.textSecondary,
                                    borderWidth: 0.5,
                                    borderRadius: 10,
                                    width: '100%',
                                    height: 42,
                                    backgroundColor: colors.newPrimary,
                                    // ...props.inputContainerStyle,
                                }}
                                secureTextEntry={props.elementConfig.name.toLowerCase().includes('password') ? hide : false}
                                rightIcon={
                                    props.elementConfig.name === 'password' && !props.noUnlock &&
                                    <Icon
                                        underlayColor="transparent"
                                        name={hide ? 'lock' : 'unlock-alt'}
                                        type="font-awesome"
                                        iconStyle={{ marginRight: 10 }}
                                        color={colors.newSecondary}
                                        hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
                                        onPress={() => setHide(!hide)}
                                    />
                                }
                            // leftIcon={props.leftIcon}
                            />
                        </View>
                    </View>
                    : null
                ;
            break;
        case ('dropdown'):
            inputElement =
                props.visible ?
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}>
                            <TouchableOpacity style={{
                                borderColor: colors.textSecondary,
                                borderWidth: 0.5,
                                borderRadius: 10,
                                width: '100%',
                                backgroundColor: colors.newPrimary,
                                height: 42,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                paddingHorizontal: responsiveWidth(3),
                                marginBottom: props.showError && !props.isValid ? 0 : responsiveHeight(3),
                                // backgroundColor: 'red',
                            }}
                                onPress={props.onPress.bind(this, props.elementConfig.name)}
                            >
                                <Typography color={props.value ? colors.newSecondary : colors.newSecondary + '99'}
                                    size={13} >{props.value ? props.value : props.elementConfig.placeholder}</Typography>
                            </TouchableOpacity>
                        </View>
                        {
                            props.showError && !props.isValid ?
                                <Typography color={colors.warning}
                                    size={11} variant="semiBold"
                                    style={{
                                        paddingLeft: 4,
                                        paddingTop: 6,
                                        marginBottom: responsiveHeight(3),
                                    }}
                                >{props.errorMessage}</Typography>
                                : null
                        }
                    </View>
                    : null
                ;
            break;
        case ('input-mask'):
            inputElement =
                props.visible ?
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: colors.textSecondary,
                        borderWidth: 1.5,
                        borderRadius: 10,
                        height: 50,
                        marginVertical: 4,
                        marginBottom: 20,
                    }}>
                        {props.leftIcon}
                        <Input
                            {...props.elementConfig}
                            style={{
                                margin: 0,
                                paddingTop: 2,
                                paddingBottom: 2,
                                marginBottom: 12,
                                width: '100%',
                                ...props.inputContainerStyle,
                                // borderBottomWidth: 1,
                                borderColor: '#eee',
                                color: colors.newTextPrimary,
                                paddingLeft: 16,
                                fontSize: 14,
                                textAlignVertical: 'bottom',
                                fontFamily: getFonts().regular,

                            }}
                            onChangeText={props.change}
                            value={props.value}
                            textContentType="telephoneNumber"
                            keyboardType="phone-pad"
                        />
                    </View>
                    : null;
            break;
        default:
            inputElement =
                <Input
                    placeholderTextColor={colors.newPrimary + 'ee'}
                    {...props.elementConfig}
                    value={props.value}
                    onChangeText={props.change}
                    errorStyle={{
                        fontFamily: getFonts().regular,
                        margin: 5,
                    }}
                    inputStyle={{ fontFamily: getFonts().regular, color: colors.darkBlue }}
                    // containerStyle={{ marginBottom: 16 }}
                    secureTextEntry={props.elementConfig.name === 'password' ? hide : false}
                    rightIcon={
                        props.elementConfig.name === 'password' &&
                        <Icon
                            underlayColor="transparent"
                            name={hide ? 'lock' : 'unlock-alt'}
                            type="font-awesome"
                            iconStyle={{ marginRight: 10 }}
                            hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
                            onPress={() => setHide(!hide)}
                        />
                    }
                />;
            break;
    }
    return inputElement;
}

export default React.forwardRef(InputComponent);
