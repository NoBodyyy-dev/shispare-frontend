import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {SolutionState} from "../interfaces/solution.interface.ts";
import {
    getAllSolutionsFunc,
    getOneSolutionFunc,
    createSolutionFunc,
    updateSolutionFunc,
    deleteSolutionFunc
} from "../actions/solution.action.ts";

export const getAllSolutionsHandler = (builder: ActionReducerMapBuilder<SolutionState>) => {
    builder
        .addCase(getAllSolutionsFunc.pending, (state) => {
            state.isLoadingSolutions = true;
            state.errorSolutions = "";
        })
        .addCase(getAllSolutionsFunc.rejected, (state, action) => {
            state.isLoadingSolutions = false;
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при получении решений";
            state.errorSolutions = errorMessage;
        })
        .addCase(getAllSolutionsFunc.fulfilled, (state, action) => {
            console.log(">>>>>>>", action.payload)
            state.isLoadingSolutions = false;
            state.errorSolutions = "";
            state.solutions = action.payload.solutions;
        });
};

export const getOneSolutionHandler = (builder: ActionReducerMapBuilder<SolutionState>) => {
    builder
        .addCase(getOneSolutionFunc.pending, (state) => {
            state.isLoadingCurrentSolution = true;
            state.errorCurrentSolution = "";
        })
        .addCase(getOneSolutionFunc.rejected, (state, action) => {
            state.isLoadingCurrentSolution = false;
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при получении решения";
            state.errorCurrentSolution = errorMessage;
            state.currentSolution = null;
        })
        .addCase(getOneSolutionFunc.fulfilled, (state, action) => {
            state.isLoadingCurrentSolution = false;
            state.errorCurrentSolution = "";
            if (action.payload?.solution) {
                state.currentSolution = action.payload.solution;
            }
        });
};

export const createSolutionHandler = (builder: ActionReducerMapBuilder<SolutionState>) => {
    builder
        .addCase(createSolutionFunc.pending, (state) => {
            state.isLoadingSolutions = true;
            state.errorSolutions = "";
        })
        .addCase(createSolutionFunc.rejected, (state, action) => {
            state.isLoadingSolutions = false;
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при создании решения";
            state.errorSolutions = errorMessage;
        })
        .addCase(createSolutionFunc.fulfilled, (state, action) => {
            state.isLoadingSolutions = false;
            state.errorSolutions = "";
            if (action.payload?.solution) {
                state.solutions.push(action.payload.solution);
            }
        });
};

export const updateSolutionHandler = (builder: ActionReducerMapBuilder<SolutionState>) => {
    builder
        .addCase(updateSolutionFunc.pending, (state) => {
            state.isLoadingSolutions = true;
            state.isLoadingCurrentSolution = true;
            state.errorSolutions = "";
            state.errorCurrentSolution = "";
        })
        .addCase(updateSolutionFunc.rejected, (state, action) => {
            state.isLoadingSolutions = false;
            state.isLoadingCurrentSolution = false;
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при обновлении решения";
            state.errorSolutions = errorMessage;
            state.errorCurrentSolution = errorMessage;
        })
        .addCase(updateSolutionFunc.fulfilled, (state, action) => {
            state.isLoadingSolutions = false;
            state.isLoadingCurrentSolution = false;
            state.errorSolutions = "";
            state.errorCurrentSolution = "";
            if (action.payload?.solution) {
                const updatedSolution = action.payload.solution;
                // Обновляем в списке
                const index = state.solutions.findIndex(s => s._id === updatedSolution._id || s.slug === updatedSolution.slug);
                if (index !== -1) {
                    state.solutions[index] = updatedSolution;
                }
                // Обновляем текущее решение, если оно открыто
                if (state.currentSolution && (state.currentSolution._id === updatedSolution._id || state.currentSolution.slug === updatedSolution.slug)) {
                    state.currentSolution = updatedSolution;
                }
            }
        });
};

export const deleteSolutionHandler = (builder: ActionReducerMapBuilder<SolutionState>) => {
    builder
        .addCase(deleteSolutionFunc.pending, (state) => {
            state.isLoadingSolutions = true;
            state.errorSolutions = "";
        })
        .addCase(deleteSolutionFunc.rejected, (state, action) => {
            state.isLoadingSolutions = false;
            const errorMessage = (action.payload as any)?.message || action.error?.message || "Ошибка при удалении решения";
            state.errorSolutions = errorMessage;
        })
        .addCase(deleteSolutionFunc.fulfilled, (state, action) => {
            state.isLoadingSolutions = false;
            state.errorSolutions = "";
            const slug = (action.payload as any)?.slug;
            if (slug) {
                // Удаляем из списка
                state.solutions = state.solutions.filter(s => s.slug !== slug);
                // Очищаем текущее решение, если оно было удалено
                if (state.currentSolution && state.currentSolution.slug === slug) {
                    state.currentSolution = null;
                }
            }
        });
};