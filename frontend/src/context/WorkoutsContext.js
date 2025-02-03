import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WORKOUTS':
            return {
                workouts: action.payload
            }
        case 'CREATE_WORKOUTS':
            return {
                workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_WORKOUTS':
            return {
                workouts: state.workouts.filter((workout) => workout._id !== action.payload._id)
            }
        case 'UPDATE_WORKOUT':
            return {
                ...state,
                workouts: state.workouts.map(workout =>
                    workout._id === action.payload._id ? action.payload : workout
                )
            };

        default:
            return state
    }
}

export function WorkoutsContextProvider({ children }) {
    const [state, dispatch] = useReducer(workoutsReducer, {
        workouts: null
    });

    return (
        <WorkoutsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </WorkoutsContext.Provider>
    )
}