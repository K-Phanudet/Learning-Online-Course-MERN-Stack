import axios from 'axios'
import {setAlert} from './alert'
import {REGISTER_FAIL,REGISTER_SUCCESS} from './types'

export const register= ({name,email,password}) => async dispatch =>{
    const config = {
        'Content-Type':'application/json'
    }
    const body = JSON.stringify({name,email,password})
    try{
        const res = await axios.post('/api/users',body,config)
        dispatch({
            type:REGISTER_SUCCESS,
            payload:{...res}
        })
    }catch(err){
        const errors = err?.response?.data?.errors
        errors &&  errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        dispatch({
            type:REGISTER_FAIL
        })
    }
}