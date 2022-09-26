import { ActionTypes } from "./actionTypes";

const initialState = {
    user: null,
    is_logged_in: true
};

export const reducers = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Login:
            state = { user: action.data, is_logged_in: true }
            break;
        case ActionTypes.Logout:
            state = { user: null, is_logged_in: false }
            break;
        case ActionTypes.UPDATE_USER:
            state = { ...state, user: action.data, }
            break;
        default:
            break;
    }
    return state;
}