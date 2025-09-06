import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import('../../../public/lottie/haha.json')
export const Preloader = () => {
    const [isClient, setIsClient] = useState(false);
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        ;
    }, []);


    useEffect(() => {
        setIsClient(true); // Убедимся, что рендерим на клиенте
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'white', // или любой другой фон
            zIndex: 9999
        }}>
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
            />
        </div>
    );
};