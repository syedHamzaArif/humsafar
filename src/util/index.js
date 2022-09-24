import { colors } from '#res/colors';
import { Alert, Dimensions, Linking, PermissionsAndroid, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Geocoder from 'react-native-geocoding';
import RNLocation from 'react-native-location';

export const { width, height } = Dimensions.get('window');

export const hitSlop = { top: 20, bottom: 20, right: 20, left: 20 };

export const getDate = (date) => {
    var today;

    if (typeof date.getMonth === 'function') today = date;
    else today = new Date(date);

    if (today.getDate) {
        var dd = String(today?.getDate()).padStart(2, '0');
        var mm = String(today?.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today?.getFullYear();
        // const SalesDate = mm + '/' + dd + '/' + yyyy
        today = mm + '-' + dd + '-' + yyyy;
    }
    return today;
};

const timeIntervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
];

const daySeconds = 86400;


export const getTimeSince = date => {
    var today;

    if (typeof date.getMonth === 'function') today = date;
    else today = new Date(date);

    if (today.getDate) {
        const seconds = Math.floor((Date.now() - today.getTime()) / 1000);
        // if (seconds > daySeconds) { return getTime(today); }
        const interval = timeIntervals.find(i => i.seconds < seconds);
        const count = Math.floor(seconds / interval.seconds);
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
    return today;
};

export const getTimeDifference = date => {
    date = new Date(date);
    const today = new Date();
    var timeDiff = (today.getTime() - date.getTime()) / 1000;
    let seconds = Math.floor(timeDiff % 60);
    let secondsAsString = seconds < 10 ? '0' + seconds : seconds;
    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    let minutesAsString = minutes < 10 ? '0' + minutes : minutes;
    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;
    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;
    let totalHours = hours + (days * 24); // add days to hours
    let totalHoursAsString = totalHours < 10 ? '0' + totalHours : totalHours;

    if (totalHoursAsString === '0F0') {
        return minutesAsString + ':' + secondsAsString;
    } else {
        return totalHoursAsString + ':' + minutesAsString + ':' + secondsAsString;
    }

};

export const get12HrFormatTime = (date) => {
    var hh = String(date?.getHours()).padStart(2, '0');
    var ampm = (hh < 12 || hh === 24) ? 'AM' : 'PM';
    hh = +hh % 12 || 12;
    var mm = String(date?.getMinutes()).padStart(2, '0');
    var time = `${hh}:${mm} ${ampm}`;

    return time;
};

export const getTime = (date) => {
    var hh = String(date?.getHours()).padStart(2, '0');
    var mmm = String(date?.getMinutes()).padStart(2, '0');
    var time = `${hh}:${mmm}`;
    return time;
};

export const getAge = date => {
    date = new Date(date);
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} years old`;
};

export const underAgeValidate = (birthday) => {
    var optimizedBirthday = birthday.replace(/-/g, '/');
    var myBirthday = new Date(optimizedBirthday);
    var currentDate = new Date().toJSON().slice(0, 10) + ' 01:00:00';
    // eslint-disable-next-line no-bitwise
    var myAge = ~~((Date.now(currentDate) - myBirthday) / (31557600000));

    if (myAge < 18) {
        return false;
    } else {
        return true;
    }

};

export const askForPermissions = async () => {
    if (Platform.OS === 'ios') {
        let result = false;
        await RNLocation.requestPermission({ ios: 'whenInUse' })
            .then(res => {
                result = res;
            })
            .catch(err => {
                console.trace('something went wrong', err);
                result = false;
            });
        return result;
    } else {
        let result;
        let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(response => {
                result = response; return response;
            })
            .catch(err => {
                throw err;
            });
        if (!granted) {
            await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ])
                .then(response => {
                    if (response['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again'
                    ) {
                        Alert.alert(
                            'Permissions Denied',
                            'Go to settings to turn then on',
                            [
                                {
                                    text: 'Go to settings',
                                    onPress: () => Linking.openSettings(),
                                },
                            ],
                            { cancelable: false }
                        );

                    }
                });
        } else { result = true; }
        return result;
    }
};


export const getCurrentLocation = async () => {
    let result = false;
    try {
        await RNLocation.configure({
            distanceFilter: 1,
            interval: 100,
            androidProvider: 'auto',
            desiredAccuracy: {
                ios: 'best',
                android: 'highAccuracy',
            },
        });
        await RNLocation.getLatestLocation(1000)
            .then(position => {
                if (position) {
                    const { latitude, longitude } = position;
                    result = { latitude, longitude };
                }
            }).catch(err => {
                console.log('err', err);
                result = false;
            });
    } catch (error) {
        console.log('error', error);
        result = false;
    }
    return result;
};

export const getAddressCustomer = async (lat, long) => {
    let result = false;
    await Geocoder.from(lat, long)
        .then(json => {
            let city;
            let address;
            let streetAddress;
            for (const index in json.results) {
                const element = json.results[index];
                if (element.types[0] === 'route') {
                    // address = element.formatted_address;
                }
                if (element.types[0] === 'street_address') {
                    streetAddress = element.address_components[0].long_name;
                }
                for (const elementIndex in element.address_components) {
                    const formatted_address = element.address_components[elementIndex];
                    if (formatted_address.types[0] === 'locality') {
                        city = formatted_address.long_name;
                    }
                    if (formatted_address.types[1] === 'sublocality') {
                        address = formatted_address.long_name;
                    }
                }
            }
            result = { address, city, streetAddress };
        })
        .catch(error => console.log(error));
    return result;
};

export const getAddress = async (lat, long) => {
    let result = false;
    await Geocoder.from(lat, long)
        .then(json => {
            let city;
            let address;
            let streetAddress;
            for (const index in json.results) {
                const element = json.results[index];
                if (element.types[0] === 'route') {
                    address = element.formatted_address;
                }
                if (element.types[0] === 'street_address') {
                    streetAddress = element.address_components[0].long_name;
                }
                for (const elementIndex in element.address_components) {
                    const formatted_address = element.address_components[elementIndex];
                    if (formatted_address.types[0] === 'locality') {
                        city = formatted_address.long_name;
                    }
                }
            }
            result = { address, city, streetAddress };
        })
        .catch(error => console.log(error));
    return result;
};

export const getLocation = async (value) => {
    let result;
    await Geocoder.from(value)
        .then((res) => {
            result = res.results[0].geometry.location;
        })
        .catch((err) => {
            console.log('err', err);
        });
    return result;
};

export const responsiveSize = (num) => {
    let updatedNum = `0.0${num}`;
    return Math.floor(height * updatedNum);
};

export const isUpperCase = value => {
    return !/[a-z]/.test(value) && /[A-Z]/.test(value);
};

export const getValue = (value) => {
    const date = new Date(value);

    if (typeof value === 'number') {
        return value;
    }

    let result = '';
    if (typeof value === 'string' && isNaN(date.getDate())) {
        if (value.includes('_')) {
            let splitValue = value.split('_');
            for (const part in splitValue) {
                let element = splitValue[part];
                element = element.charAt(0).toUpperCase() + element.slice(1);
                result = result + ' ' + element;
            }
            return result.trim();
        }
        else if (value.includes('-')) {
            let splitValue = value.split('-');
            for (const part in splitValue) {
                let element = splitValue[part];
                element = element.charAt(0).toUpperCase() + element.slice(1);
                result = result + ' ' + element;
            }
            return result.trim();
        }
        else {
            result = isUpperCase(value) ? value : value.replace(/([A-Z])/g, ' $1');
            result = result.charAt(0).toUpperCase() + result.slice(1);
            return result.trim();
        }
    } else if (!isNaN(date.getDate())) {
        return getDate(date);
    } else return value;
};

export const showPopUpMessage = (title, description, type,) => {
    showMessage({
        message: title,
        type: type ? type : 'danger',
        duration: 5000,
        position: 'top',
        description: description,
        titleStyle: { fontSize: 18 },
        textStyle: { fontSize: 12 },
        color: 'white',
        // backgroundColor: colors.primary,
        hideOnPress: true,
        floating: true,
    });
};

export const isIOS = () => Platform.OS === 'ios';

export const getFonts = () => {
    return ({
        regular: isIOS() ? 'Montserrat-Regular' : 'Montserrat-Regular',
        light: isIOS() ? 'Montserrat-Light' : 'Montserrat-Light',
        bold: isIOS() ? 'Montserrat-Bold' : 'Montserrat-Bold',
        black: isIOS() ? 'Montserrat-Black' : 'Montserrat-Black',
        heavy: isIOS() ? 'Montserrat-Heavy' : 'Montserrat-ExtraBold',
        medium: isIOS() ? 'Montserrat-Medium' : 'Montserrat-Medium',
        semiBold: isIOS() ? 'Montserrat-SemiBold' : 'Montserrat-SemiBold',
        thin: isIOS() ? 'Montserrat-Thin' : 'Montserrat-Thin',
        ultraLight: isIOS() ? 'Montserrat-Ultralight' : 'Montserrat-UltraLight',
    });
};

export const getInitials = (string) => {
    if (!string) return null;
    var initials = string.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
};

export const timeConvert = (n) => {
    var num = n;
    var hours = (num / 60);
    var rHours = Math.floor(hours);
    var minutes = (hours - rHours) * 60;
    var rMinutes = Math.round(minutes);
    if (rHours) {
        return rHours + ' hr, ' + rMinutes + ' min';
    } else {
        return rMinutes + ' min';
    }
};


export const getRegionForCoordinates = (points) => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY,
    };
};

export const updateReducer = (name, value, actionCreator) => {
    let obj = { name, value };
    actionCreator(obj);
};

export const random6digitnum = () => Math.floor(100000 + Math.random() * 900000);

export const getFilterUrl = (url, filters) => {
    var updatedUrl = url;
    Object.entries(filters).map(([key, value], index) => {
        updatedUrl = `${updatedUrl}${index === 0 ? '?' : '&'}${key}=${value}`;
    });

    return updatedUrl;
};