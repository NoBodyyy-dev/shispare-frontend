export const useCalculatePriceWithDiscount = (price: number, discount: number) => Number(price - (price / 100 * discount)).toFixed(2)
export const useHandleDate = () => {
    return (date: Date | string) => {
        const dateString = typeof date === 'string' ? date : date.toISOString();
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}.${month}.${year}`;
    };
};