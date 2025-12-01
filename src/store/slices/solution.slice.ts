import {ActionReducerMapBuilder, createSlice} from "@reduxjs/toolkit";
import {SolutionState} from "../interfaces/solution.interface.ts";
import {
    getAllSolutionsHandler,
    getOneSolutionHandler,
    createSolutionHandler,
    updateSolutionHandler,
    deleteSolutionHandler
} from "../handlers/solution.handler.ts";

const initialState: SolutionState = {
    solutions: [],
    currentSolution: null,
    isLoadingSolutions: false,
    isLoadingCurrentSolution: false,
    errorCurrentSolution: "",
    errorSolutions: ""
}

const solutionSlice = createSlice({
    name: "solution",
    initialState,
    reducers: {
        clearCurrentSolution: (state) => {
            state.currentSolution = null;
            state.errorCurrentSolution = "";
        },
        clearErrors: (state) => {
            state.errorSolutions = "";
            state.errorCurrentSolution = "";
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<SolutionState>) => {
        getAllSolutionsHandler(builder);
        getOneSolutionHandler(builder);
        createSolutionHandler(builder);
        updateSolutionHandler(builder);
        deleteSolutionHandler(builder);
    },
})

export const { clearCurrentSolution, clearErrors } = solutionSlice.actions;
export default solutionSlice.reducer;