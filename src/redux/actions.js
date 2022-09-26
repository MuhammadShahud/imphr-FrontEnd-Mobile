import { ActionTypes } from "./actionTypes";

export const LoginAction=(user)=>{
    return {
        type:ActionTypes.Login,
        data:user,
    }
}

export const LogoutAction=()=>{
    return {
        type:ActionTypes.Logout,
    }
}


export const UpdateAction=(user)=>{
    return {
        type:ActionTypes.UPDATE_USER,
        data:user,
    }
}