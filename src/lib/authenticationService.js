const baseUrl = 'http://localhost:5000';

export const login = (formData) => {
    return fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
    })
        .then(res => {
            sessionStorage.setItem('headers', JSON.stringify(res.headers));
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
        body: JSON.stringify(formData),
        credentials: 'include'
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
        },
        credentials: 'include'
    })
        .then(res => {
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
        },
        credentials: 'include'
    })
        .then(res => {
            console.log(res);
            return res.json()
        })
        .catch(err => console.log(err))

};