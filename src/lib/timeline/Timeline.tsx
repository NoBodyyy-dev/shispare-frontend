import React from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import styles from "./timeline.module.sass";

type TimelineItem = {
    id: string;
    year: string;
    content: React.ReactNode[];
};

type Props = {
    items: TimelineItem[];
};

const Timeline: React.FC<Props> = ({items}) => {
    const prefersReducedMotion = useReducedMotion();
    
    if (!items || items.length === 0) {
        return <div className={styles.timeline} style={{padding: '20px', background: '#f0f0f0'}}>Нет данных для отображения</div>;
    }
    
    return (
        <div className={styles.timeline}>
            <div className={styles.timeline__line}></div>
            <div className={styles.timeline__container}>
                {items.map((item, index) => {
                    const isEven = index % 2 === 0;
                    // Четные блоки сверху, нечетные снизу
                    const isTop = isEven;
                    
                    return (
                        <motion.div
                            key={item.id}
                            className={`${styles.timeline__item} ${isTop ? styles.timeline__item_top : styles.timeline__item_bottom}`}
                            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : (isTop ? -30 : 30) }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15, margin: "-50px" }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <div className={styles.timeline__content}>
                                <h3 className={styles.timeline__year}>
                                    {item.year}
                                </h3>
                                <div className={styles.timeline__text}>
                                    {item.content.map((contentItem, contentIndex) => (
                                        <p
                                            key={contentIndex}
                                            className={styles.timeline__paragraph}
                                        >
                                            {contentItem}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.timeline__marker}>
                                <div className={styles.timeline__markerDot}></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;

