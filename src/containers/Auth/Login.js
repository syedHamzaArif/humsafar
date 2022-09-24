import images from '#assets/index';
import Loader from '#components/common/Loader';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { AuthContext } from '#context/';
import { colors } from '#res/colors';
import globalStyles from '#res/global.styles';
import { random6digitnum, showPopUpMessage } from '#util/index';
import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import Lock from 'react-native-vector-icons/FontAwesome';
import styles from './styles/login.styles';

const Login = ({ navigation, route }) => {
    const number = route?.params?.phoneNumber;

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [highlightLoading, setHighlightLoading] = useState(false);

    const { signIn } = useContext(AuthContext);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return backHandler.remove;
    }, []);

    const forgetPasswordPressHandler = async () => {
        try {
            setHighlightLoading(true);
            const updatedCode = random6digitnum();
            const result = await Service.getOTP(number, updatedCode);
            if (result === 'OK') {
                navigation.navigate('OTP', { phoneNumber: number, OTPCode: updatedCode, from: 'forget-password' });
            } else {
                showPopUpMessage('Failed', 'Unable to send OTP right now, Please try later');
            }
        } catch (err) {
            console.trace('Inside Catch => ', err);
        } finally {
            setHighlightLoading(false);
        }
    };


    const pressHandler = async () => {
        setLoading(true);
        try {
            const obj = {
                cell_no: number,
                password: password,
            };
            await signIn(obj);
        } catch (_err) {
            console.trace('Inside Catch => ', _err);
            setError(_err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            {highlightLoading && <Loader />}
            <View style={styles.header}>
                <Image resizeMode="stretch"
                    source={images.header_bg}
                    style={globalStyles.image} />
            </View>

            <View style={styles.main} >
                <Typography new style={styles.heading} >Enter Your Password</Typography>
                <View style={[styles.inputRow, { justifyContent: 'space-between' }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.newPrimary}
                        secureTextEntry={showPassword ? false : true}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            error && setError('');
                        }}
                    />
                    <TouchableOpacity
                        onPress={setShowPassword.bind(this, !showPassword)}
                        hitSlop={{ right: 20, left: 20, top: 20, bottom: 20 }}>
                        <Lock name={showPassword ? 'unlock' : 'lock'} size={24} style={{ marginTop: 12 }} color={colors.newPrimary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={forgetPasswordPressHandler} style={styles.forgetPassword}>
                    <Typography new size={12} variant="semiBold" >
                        Forgot Password?
                    </Typography>
                </TouchableOpacity>
                {
                    error ? <Typography new variant="semiBold" style={styles.error}>{error}</Typography> : null
                }
            </View>
            <View style={styles.footer} >
                <TouchableOpacity onPress={pressHandler}
                    disabled={loading}
                    activeOpacity={1} style={styles.footerButton} >
                    {
                        loading && <ActivityIndicator style={styles.loader} color={colors.newPrimary} size={24} />
                    }
                    <Image source={images.footer_btn_alt} style={globalStyles.image} resizeMode="cover" />
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Login;
