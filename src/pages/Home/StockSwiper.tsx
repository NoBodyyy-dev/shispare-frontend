import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination, Navigation, Autoplay} from "swiper/modules";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {StockSkeleton} from "../../lib/skeletons/StockSkeleton.tsx";
import {useEffect} from "react";
import {getAllStocks} from "../../store/actions/stock.action.ts";
import {Link} from "react-router-dom";
import './home.sass';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function StockSwiper() {
    const dispatch = useAppDispatch();
    const {stocks, isLoadingStocks} = useAppSelector(state => state.stock);

    useEffect(() => {
        dispatch(getAllStocks());
    }, [dispatch]);

    if (isLoadingStocks) return <StockSkeleton/>;
    if (!stocks.length) return null;

    return (
        <div className="stock">
            {stocks.length === 1 ? (
                <Link to={`/stock/${stocks[0].slug}`}>
                    <img className="single-stock" src={stocks[0].image} alt={stocks[0].slug}/>
                </Link>
            ) : (
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    navigation={true} pagination={true}
                    className="stock__container"
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}>
                    {stocks.map((stock) => (
                        <SwiperSlide key={stock._id}>
                            <Link to={`/stock/${stock.slug}`}>
                                <img src={stock.image} alt={stock.slug}/>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
