import {REGISTER_SUCCESS,REGISTER_FAIL} from '../actions/types'
const initialState = {
    token = localStorage.getItem('token'),
    isAuthenticated:false,
    loading:true,
    user:null 
}

export default function auth(state = initialState,action) {
    const {type,payload} = action
    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token',payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated:true,
                loading:false
            }
        case REGISTER_FAIL:
            return {
                ...state,
                ...payload,
                loading:false,
                isAuthenticated:false
            }
        default:
            return state
    }
}