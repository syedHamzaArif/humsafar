import axios from 'axios';
import Config from 'react-native-config';

const baseURL = Config.SERVER + 'api/v1/';

const instance = axios.create({
    baseURL,
    timeout: 100000,
    timeoutErrorMessage: 'Connection Timeout, Internet is slow.',
});

export default instance;
