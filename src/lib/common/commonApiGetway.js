const baseUrl = 'http://localhost:5000';

export const getRequest = (apiUrl) => {
    return fetch(baseUrl + apiUrl, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => successHandle(res))
        .catch(err => errorHandle(err))

};

export const postRequest = (apiUrl, data) => {
    return fetch(baseUrl + apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include'
    })
        .then(res => successHandle(res))
        .catch(err => errorHandle(err))
};

function errorHandle(err) {
    window.location.href = 'http://localhost:3000/login';
}

function successHandle(res) {
    return res.json();
}