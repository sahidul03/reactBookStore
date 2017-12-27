const baseUrl = 'http://localhost:5000';

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
    console.log(err)
    // window.location.href = 'http://localhost:3000/login';
}

function successHandle(res) {
    return res.json();
}

function headers() {
    let accessToken =  sessionStorage.getItem('token');
    let headers = {
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken
    };
    console.log(headers);
    return headers;
}