import {useAppSelector, useAppDispatch} from "../../hooks/state.hook.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getOneSolutionFunc} from "../../store/actions/solution.action.ts";
import {MiniProductCard} from "../../lib/products/MiniProductCard.tsx";
import styles from "./solution.module.sass"
import {useAuth} from "../../context/AuthContext.tsx";

export const OneSolutionPage = () => {
    const dispatch = useAppDispatch();
    const {slug} = useParams<{ slug: string }>();
    const {user} = useAuth();
    const {currentSolution, isLoadingCurrentSolution, errorCurrentSolution} = useAppSelector(state => state.solution)
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (slug) {
            dispatch(getOneSolutionFunc(slug));
        }
    }, [slug]);

    const handlePointClick = () => {
        detailsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    if (isLoadingCurrentSolution) return <div className="main__container">Загрузка...</div>
    if (errorCurrentSolution) {
        return <div className="main__container"><p>Ошибка: {errorCurrentSolution}</p></div>
    }

    return (
        <div className={`main__container ${user?.role === "Admin" ? "p-20" : ""}`}>
            <h1 className="title mb-20">{currentSolution?.name}</h1>
            <div className={styles.solutionPage}>
                <div className={styles.mainImageContainer}>
                    <img
                        src={currentSolution?.image}
                        alt={currentSolution?.name}
                        className={styles.mainImage}
                    />
                    {currentSolution?.details && currentSolution?.details.map((detail, index) => (
                        <button
                            key={index}
                            className={styles.point}
                            style={{
                                left: `${detail.position.left}%`,
                                top: `${detail.position.top}%`,
                            }}
                            onClick={() => handlePointClick()}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {currentSolution?.details.map((detail, index) => (
                    <div
                        ref={detailsRef}
                        className={styles.details}
                    >
                        <h2 className="subtitle">{index + 1} - {detail.section}</h2>
                        {detail.description && (
                            <p className={styles.description}>{detail.description}</p>
                        )}
                        <div className={styles.products}>
                            {detail.products && detail.products.map((product, index) => (
                                <MiniProductCard key={product._id || index} product={product}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

