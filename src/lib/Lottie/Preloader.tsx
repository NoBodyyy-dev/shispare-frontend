import Lottie from 'react-lottie';
import animation from "../../../public/lottie/haha.json"

export const Preloader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return <Lottie options={defaultOptions} height={400} width={400} />;
};
