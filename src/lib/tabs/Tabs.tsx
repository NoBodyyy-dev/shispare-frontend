import React, {useState, ReactNode} from 'react';
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
    const activeTabContent = currentTab.content.map((tabLi) => {
        return <li className="line mb-10">{tabLi}</li>
    });

    return (
        <div className={`${styles.tabs} flex gap-20`}>
            <div className="tabs-header" role="tablist">
                {props.tabs.map((tab) => (
                    <div
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`${styles.tabsLabel} fz-20 p-10 mb-8 ${activeTab === tab.id ? `active ` : ''}
                    `}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className={`${styles.tabs__content} p-30`} role="tabpanel">
                <ul className="pl-20">
                    {activeTabContent}
                </ul>
                {currentTab.image && <img src={currentTab.image} alt="" className={styles.tabs__contentImg}/>}
            </div>
        </div>
    );
};

export default Tabs;