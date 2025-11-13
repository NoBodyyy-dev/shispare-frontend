// lib/map/MainMap.tsx
import {YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import "./map.sass";
import {useEffect, useState} from "react";
import SkeletonMap from "../skeletons/MapSkeleton";

type Props = {
    geomX: number;
    geomY: number;
    showInfo?: boolean;
};

export default function MainMap({ geomX, geomY, showInfo = false }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const mapState = {
        center: [geomY, geomX],
        zoom: 17,
    };

    const iconOptions = {
        preset: "islands#circleDotIcon",
        iconColor: "#00458B",
        iconCaption: "ООО 'ШИСПАР'",
        iconContent: "1",
    };

    const handleMapLoad = () => {
        setIsLoading(false);
        setIsError(false);
    };

    const handleMapError = () => {
        setIsLoading(false);
        setIsError(true);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                setIsError(true);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <div className={"mapContainer"}>
            {isLoading && <SkeletonMap/>}

            {!isLoading && isError && (
                <div className="">
                    <p>Не удалось загрузить карту.</p>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            setIsError(false);
                        }}
                        className=""
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {!isError && (
                <YMaps query={{apikey: import.meta.env.VITE_YMAPS_API_KEY!}}>
                    <Map
                        state={mapState}
                        width="100%"
                        height="400px"
                        modules={["control.ZoomControl", "control.FullscreenControl"]}
                        onLoad={handleMapLoad}
                        onError={handleMapError}
                    >
                        {showInfo
                            && <div className="mapDescription">
                                <div className={"mapDescriptionBlock p-12 mb-10"}>
                                    <p className="mb-20">Способы связи</p>
                                    <span>
                                    <p className="color-blue mb-3">+7 (988) 312-14-14</p>
                                    <p className="color-blue">+7 (861) 241-31-37</p>
                                </span>
                                </div>
                                <div className={"mapDescriptionBlock p-12"}>
                                    <p className="mb-20">Адрес</p>
                                    <span>
                                    <p className="color-blue mb-3">г. Краснодар</p>
                                    <p className="color-blue">ул. Кирпичная 1/2</p>
                                </span>
                                </div>
                            </div>
                        }
                        <Placemark
                            geometry={[geomY, geomX]}
                            options={{...iconOptions}}
                        />
                    </Map>
                </YMaps>
            )}
        </div>
    );
}
