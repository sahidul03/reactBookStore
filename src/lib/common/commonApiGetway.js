import config from '../../config'
const baseUrl = config.backendBaseUrl;

export const getRequest = (apiUrl) => {
    return fetch(baseUrl + apiUrl, {
        method: 'GET',
        headers: headers()

    })
        .then(res => successHandle(res))
        .catch(err => errorHandle(err))

};

export const postRequest = (apiUrl, data) => {
    return fetch(baseUrl + apiUrl, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    })
        .then(res => successHandle(res))
        .catch(err => errorHandle(err))
};

function errorHandle(err) {
    console.log(err);
    if(window.location.href !== config.frontendBaseUrl + '/login' && window.location.href !== config.frontendBaseUrl + '/signup'){
        window.location.href = config.frontendBaseUrl + '/login';
    }
}

function successHandle(res) {
    if(res.status === 401){
        if(window.location.href !== config.frontendBaseUrl + '/login' && window.location.href !== config.frontendBaseUrl + '/signup'){
            window.location.href = config.frontendBaseUrl + '/login';
        }
    }else {
        return res.json();
    }
}

function headers() {
    let accessToken =  localStorage.getItem('token');
    let headers = {
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken
    };
    return headers;
}