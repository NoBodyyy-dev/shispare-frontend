import {FC, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, A11y} from "swiper/modules";
import {Product} from "../products/Product.tsx";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import {useCheckCartData} from "../../hooks/util.hook.ts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const SeenStory: FC = () => {
    const [story, setStory] = useState<ProductInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useCheckCartData(setIsLoading, setStory, setError, JSON.parse(localStorage.getItem("story")! || "[]").map((s: ProductInterface) => s._id));

    if (isLoading || error) return

    if (!story.length) return (
        <div className="px-4 py-6">
            <h2 className="subtitle mb-20">Вы недавно смотрели</h2>
            <div className="text-center py-10">Вы еще не просматривали товары</div>
        </div>
    );

    return (
        <div className="px-4 py-6">
            <h2 className="subtitle mb-20">Вы недавно смотрели</h2>
            <Swiper
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={16}
                slidesPerView={2}
                navigation
                pagination={{clickable: true}}
                breakpoints={{
                    640: {slidesPerView: 3},
                    1024: {slidesPerView: 4},
                    1280: {slidesPerView: 5}
                }}
            >
                {story.map((product) => (
                    <SwiperSlide key={product._id}>
                        <Product productData={product}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};