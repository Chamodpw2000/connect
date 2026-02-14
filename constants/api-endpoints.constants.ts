export const AUTH_ENDPOINTS = {
    LOGIN:'auth/login',
    LOGOUT: 'auth/logout',
    REGISTER: 'auth/register',

    
}

export const POSTS_ENDPOINTS = {

    CREATE: "posts",
    UPDATE: "posts/:id",
    DELETE: "posts/:id",
    GET_ALL: "posts",
    GET_BY_ID: "posts/:id",
    GET_BY_USER: "posts/:email",

}

export const USERS_ENDPOINTS = {
    GET_BY_EMAIL: "user/:email",
    UPDATE: "edit-profile/:id",
}



