import {ProductInterface} from "./product.interface.ts";

export interface ISolution {
    _id: string;
    name: string;
    slug: string;
    image: string;
    details: ISolutionDetail[];
}

export interface IBody {
    name: string;
    image: string;
    details: ISolutionDetail[];
}

export interface ISolutionDetail {
    section: string;
    description?: string;
    products: ProductInterface[];
    position: {
        left: number;
        top: number;
    }
}

export interface SolutionState {
    solutions: ISolution[];
    currentSolution: ISolution | null;
    isLoadingSolutions: boolean;
    isLoadingCurrentSolution: boolean;
    errorCurrentSolution: string;
    errorSolutions: string
}