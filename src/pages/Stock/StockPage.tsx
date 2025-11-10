import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useParams} from "react-router-dom";
import {getStockBySlug} from "../../store/actions/stock.action.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {StockInterface} from "../../store/interfaces/stock.interface.ts";

export const StockPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const {curStock, isLoadingCurStock, errCurStock} = useAppSelector(state => state.stock);
    const params = useParams<{ "stock-slug": string }>();

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/stock/${curStock?.slug}`, label: curStock?.title || "Акция"},
    ];

    useEffect(() => {
        if (params["stock-slug"]) {
            dispatch(getStockBySlug(params["stock-slug"]));
        }
    }, [params["stock-slug"], dispatch]);

    if (isLoadingCurStock) return <div className="main__container">Загрузка...</div>;
    if (errCurStock) return <div className="main__container">Ошибка: {errCurStock}</div>;
    if (!curStock || !curStock._id) return <div className="main__container">Акция не найдена</div>;

    const stock = curStock as StockInterface;

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingCurStock}/>
            <article className="stock-page">
                <h1 className="title mb-20">{stock.title}</h1>
                
                {stock.image && (
                    <div className="mb-20">
                        <img
                            src={stock.image}
                            alt={stock.title}
                            style={{width: '100%', maxWidth: '800px', borderRadius: '8px'}}
                        />
                    </div>
                )}

                {stock.description && (
                    <div className="mb-20">
                        <p className="fz-16 font-roboto" style={{lineHeight: '1.6'}}>
                            {stock.description}
                        </p>
                    </div>
                )}

                {stock.conditions && Array.isArray(stock.conditions) && stock.conditions.length > 0 && (
                    <div className="mb-20">
                        <h2 className="subtitle mb-15">Условия акции:</h2>
                        <ul style={{listStyle: 'disc', paddingLeft: '20px'}}>
                            {stock.conditions.map((condition: string, index: number) => (
                                <li key={index} className="fz-16 font-roboto mb-10" style={{lineHeight: '1.6'}}>
                                    {condition}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {stock.start && stock.end && (
                    <div className="mb-20">
                        <p className="fz-14 color-gray">
                            Период действия: {new Date(stock.start).toLocaleDateString('ru-RU')} - {new Date(stock.end).toLocaleDateString('ru-RU')}
                        </p>
                    </div>
                )}
            </article>
        </div>
    );
};
