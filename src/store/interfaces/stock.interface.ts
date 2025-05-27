export type AllStocksInterface = Partial<{
    _id: string;
    slug: string;
    image: string;
}>

export type StockInterface = Partial<{
    title: string;
    description: string;
    conditions: string;
    start: Date;
    end: Date;
}> & AllStocksInterface;

export interface StockState {
    stocks: AllStocksInterface[];
    curStock: StockInterface;
    isLoadingStocks: boolean;
    isLoadingCurStock: boolean;
    errorStocks: string | null;
    errCurStock: string | null;
};