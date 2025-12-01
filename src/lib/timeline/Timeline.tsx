import React, {FC} from "react";
import {motion} from "framer-motion";
import styles from "./timeline.module.sass";

interface TimelineItem {
    year: string;
    title: string;
    description: string | React.ReactNode;
    image?: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export const Timeline: FC<TimelineProps> = ({items}) => {
    const itemAnimation = {
        initial: {opacity: 0, y: 50},
        whileInView: {opacity: 1, y: 0},
        viewport: {once: true, margin: "-100px"},
        transition: {duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    };

    return (
        <div className={styles.timeline}>
            <div className={styles.timelineLine}></div>
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
                    {...itemAnimation}
                    transition={{...itemAnimation.transition, delay: index * 0.1}}
                >
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                        <div className={styles.timelineYear}>{item.year}</div>
                        <h3 className={styles.timelineTitle}>{item.title}</h3>
                        <div className={styles.timelineDescription}>{item.description}</div>
                        {item.image && (
                            <div className={styles.timelineImage}>
                                <img src={item.image} alt={item.title} />
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

