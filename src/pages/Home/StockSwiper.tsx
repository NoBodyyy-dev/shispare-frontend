import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination, Navigation, Autoplay} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './home.sass';
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllStocks} from "../../store/actions/stock.action.ts";
import {StockSkeleton} from "../../lib/skeletons/StockSkeleton.tsx";

export default function StockSwiper() {
    const dispatch = useAppDispatch();
    const {stocks, isLoadingStocks} = useAppSelector(state => state.stock);

    useEffect(() => {
        // dispatch(getAllStocks());
        console.log("penis")
    }, [dispatch]);

    if (isLoadingStocks) {
        return <StockSkeleton />;
    }

    if (!stocks.length) return null;

    return (
        <div className="stock">
            {stocks.length === 1 ? (
                <img className="single-stock" src={``} alt={stocks[0].slug} />
                    ) : (
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        navigation={true} pagination={true}
                        className="stock__container"
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}>ы
                        {stocks.map((stock) => (
                            <SwiperSlide key={stock._id}>
                                <img src={stock.image} alt={stock.slug}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    )}
                </div>
            );
            }
