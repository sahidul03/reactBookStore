const baseUrl = 'http://localhost:5000';

export const login = (formData) => {
    return fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(res => {
            // sessionStorage.setItem('headers', JSON.stringify(res.headers));
            return res.json()
        })
        .catch(err => console.log(err))

};

export const signUp = (formData) => {
    return fetch(baseUrl + '/users', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

};

export const logout = () => {
    return fetch(baseUrl + '/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            sessionStorage.removeItem('token');
            return res.json()
        })
        .catch(err => console.log(err))

};

export const getProfile = () => {
    return fetch(baseUrl + '/profile', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            console.log(res);
            return res.json()
        })
        .catch(err => console.log(err))

};

export const loggingStatus = () => {
    return fetch(baseUrl + '/logging-status', {
        method: 'GET',
        headers: headers()
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

};

function headers() {
    let accessToken =  sessionStorage.getItem('token');
    let headers = {
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken
    };
    return headers;
}