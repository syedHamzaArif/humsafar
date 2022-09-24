export const errorHandler = (error) => {
    if (error.response) {
        // console.log('file: errorHandler.js => line 3 => errorHandler => error.response', error.response);
        let errorMessage = '';
        if (error.response.data.message) {
            errorMessage = error.response.data.message ? error.response.data.message :
                error.response.data.error_description ? error.response.data.error_description : 'Something went wrong';
            if (error.response.data.ModelState) {
                for (const key in error.response.data.ModelState) {
                    const element = error.response.data.ModelState[key];
                    errorMessage = errorMessage + ' ' + element;
                }
            }
        } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
        } else {
            errorMessage = 'Something went wrong';
        }
        return errorMessage;
    } else if (error.request) {
        return error.message;
    } else {
        return 'Something went wrong';
    }
};
