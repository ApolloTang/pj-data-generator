import { combineReducers } from 'redux';

// import resources from './resources';
// import session from './session';


const rdx_item = ( state={}, action ) => {
    switch (action.type) {
        case 'toggleProperty_isTrue':
            if (state.id !== action.id) {
                return state;
            } else {
                return { ...state, isTrue:!state.isTrue };
            }
            break;
        case 'addItem':
            return { id: action.id, text:action.text, isTrue: false}
            break;
        default:
            return state;
    }
};

const rdx_collection = ( state=[], action ) => {
    switch (action.type){
        case 'toggleProperty_isTrue' :
            return state.map( stateItem => rdx_item(stateItem, action) );
            break;
        case 'addItem' :
            const newItem = rdx_item( state, action );
            return [...state, newItem ]
            break;
        default :
            return state;
    }
};

const rdx_visibilityFilter = ( state='showAll', action ) => {
    switch (action.type) {
        case 'setFilter':
            return action.visibilityFilter;
        default:
            return state;
    }
}

export default combineReducers({
    collection      : rdx_collection,
    visibilityFilter: rdx_visibilityFilter
});
