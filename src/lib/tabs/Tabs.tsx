import React, {useState, ReactNode} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import styles from "./tabs.module.sass"

type TabItem = {
    id: string;
    label: string;
    contentTitle: string;
    content: ReactNode[];
    image: string;
};

type Props = {
    tabs: TabItem[];
};

const Tabs: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState<string>(props.tabs[0].id);
    const currentTab = props.tabs.find((tab) => tab.id === activeTab)!;
    const activeTabContent = currentTab.content.map((tabLi, index) => {
        return <motion.li 
            key={index}
            className="line mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            {tabLi}
        </motion.li>
    });

    const tabVariants = {
        inactive: {
            scale: 1,
            backgroundColor: "#ffffff",
            color: "#666",
        },
        active: {
            scale: 1.02,
            backgroundColor: "rgba(239, 59, 38, 0.1)",
            color: "#EF3B26",
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div 
            className={`${styles.tabs} flex gap-20`}
            initial="hidden"
            animate="visible"
        >
            <div className="tabs-header" role="tablist">
                {props.tabs.map((tab, index) => (
                    <motion.div
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`${styles.tabsLabel} fz-20 p-10 mb-8 ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        variants={tabVariants}
                        animate={activeTab === tab.id ? "active" : "inactive"}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tab.label}
                    </motion.div>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    className={`${styles.tabs__content} p-30`} 
                    role="tabpanel"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <ul>
                        {activeTabContent}
                    </ul>
                    {currentTab.image && (
                        <motion.img 
                            src={currentTab.image} 
                            alt="" 
                            className={styles.tabs__contentImg}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default Tabs;