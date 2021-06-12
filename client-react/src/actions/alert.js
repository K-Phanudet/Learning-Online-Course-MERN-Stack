import {SET_ALERT,REMOVE_ALERT} from './types'
import {v4} from 'uuid'
export const setAlert = (msg,typeAlert,timeOut=5000) => dispatch => {
    const id = v4()
    dispatch({
        type:SET_ALERT,
        payload:{id,msg,typeAlert}
    })
    setTimeout(()=>dispatch({
        type:REMOVE_ALERT,
        payload:id
    }),5000)
    
}