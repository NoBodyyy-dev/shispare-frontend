import styles from "./about.module.sass"
import Tabs from "../../lib/tabs/Tabs.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {FC} from "react";

export const About: FC = () => {
    const breadcrumbsItems = [
        {
            path: "/",
            label: "Главная"
        },
        {
            path: `/about`,
            label: "О компании",
        },
    ];

    const achievements = [
        {
            logo: "/about/DJSI-logo.png",
            text: "Включение в список компаний, лидирующих в области устойчивого развития.",
            company: "DJSI"
        },
        {logo: "/about/CDP-logo.png", text: "Высшая оценка за усилия по борьбе с изменением климата.", company: "CDP"},
        {
            logo: "/about/ECOVADIS-logo.png",
            text: "Платиновый рейтинг за достижения в области корпоративной социальной ответственности",
            company: "ECOVADIS"
        },
        {logo: "/about/RD100-logo.png", text: "Награда за разработку передовых технологий", company: "RD100"},
        {logo: "/about/ST-logo.png", text: "Награда за новую высокоэффективную клеевую технологию.", company: "ST"},
        {logo: "/about/GPTW-logo.png", text: "Признание одной из лучших компаний для работы.", company: "GPTW"},
    ]

    const tabs = [
        {
            id: "tab1",
            label: "1910-1930",
            contentTitle: "Основание и рост",
            content: [
                <>1910 - <span className="font-roboto">Компания <span
                    className="color-red">Sika</span> была основана</span> Каспаром Винклером (Kaspar Winkler) <span
                    className="font-roboto">в городе</span> Цюрих, Швейцария. <span className="font-roboto">Винклер, будучи инженером, разработал инновационную добавку для бетона под названием Sika-1, которая значительно улучшала водонепроницаемость бетонных конструкций. Это изобретение стало революционным для строительства туннелей, мостов и других инфраструктурных объектов.</span></>,
                <>1918 - <span className="font-roboto">Успех Sika-1 позволил компании начать экспорт продукции за пределы Швейцарии. Первые зарубежные филиалы были открыты в Германии, Франции и Италии.</span></>,
                <>1920 - <span className="font-roboto">Разработка Sika-Rapid – ускорителя твердения бетона. Компания участвовала в восстановлении Европы после Первой мировой войны.</span></>
            ],
            image: "/about/ECOVADIS-logo.png"
        },
        {
            id: "tab2",
            label: "1930-1945",
            contentTitle: "Основание и рост",
            content: [
                <>1930 - <span className="font-roboto">Мировой экономический кризис 1930-х годов стал серьезным испытанием для <span
                    className="color-red">Sika</span>. Однако компания не только выстояла, но и продолжила инновационную деятельность, представив линейку антикоррозионных покрытий для стальных конструкций. Эти разработки особенно востребованы в промышленном строительстве и мостостроении.</span></>,
                <>1939-45 - <span className="font-roboto">В период Второй мировой войны Sika сосредоточила свои усилия на обеспечении ремонта и сохранения критически важной инфраструктуры. Компания поставляла материалы для восстановления поврежденных мостов, ремонта бункеров и других защитных сооружений. Несмотря на военное время, Sika продолжала ограниченные научные исследования, заложив основы для послевоенного развития.</span></>,
            ],
            image: "/about/ECOVADIS-logo.png"
        },
        {
            id: "tab3",
            label: "1945-1970",
            contentTitle: "Основание и рост",
            content: [
                <>1950 - <span className="font-roboto">В 1950-х годах компания вышла на рынки Северной и Южной Америки, открыв представительства в США и Бразилии. В это же время была представлена линейка строительных клеев <span
                    className="color-red">SikaBond®</span>, которые произвели революцию в технологии монтажа строительных конструкций.</span></>,
                <>1963 - <span className="font-roboto">ознаменовался выпуском Sikaflex® - первого в мире эластичного полиуретанового герметика, который нашел применение в строительстве небоскребов и судостроении. В 1968 году <span
                    className="color-red">Sika</span> сделала важный шаг в азиатской экспансии, открыв производство в Японии, что стало плацдармом для дальнейшего освоения рынков Азиатско-Тихоокеанского региона.</span></>
            ],
            image: "/about/ECOVADIS-logo.png"
        },
        {
            id: "tab4",
            label: "1970-2000",
            contentTitle: "Основание и рост",
            content: [
                <>1975 - <span className="font-roboto">Cтал важной вехой в истории компании с разработкой <span
                    className="color-red">Sika® ViscoCrete</span> - инновационного суперпластификатора для самоуплотняющегося бетона. Эта технология коренным образом изменила подходы к бетонированию сложных конструкций.</span></>,
                <>1989 - <span className="font-roboto"><span className="color-red">Sika</span> осуществила стратегическое приобретение таиландской компании Thaicoat, значительно укрепив свои позиции на азиатском рынке. В 1990-х годах компания сделала серьезный акцент на экологической безопасности, представив первую линейку строительных материалов с пониженным содержанием летучих органических соединений (VOC).</span></>
            ],
            image: "/about/ECOVADIS-logo.png"
        },
        {
            id: "tab5",
            label: "2000-нв.",
            contentTitle: "Основание и рост",
            content: [
                <>2008 - <span className="font-roboto">В 2008 году продукты <span className="color-red">Sika</span> использовались при строительстве самых амбициозных архитектурных проектов - небоскреба Бурдж-Халифа в Дубае и стадиона "Птичье гнездо" в Пекине. В 2016 году компания совершила крупнейшую в своей истории сделку, приобретя MBCC Group (бывшее подразделение строительной химии BASF).</span></>,
                <>2023 - <span className="font-roboto">В 2023 году компания представила линейку углеродно-нейтральных продуктов Sika Terra, подтвердив свои амбиции достичь нулевого уровня выбросов к 2050 году.</span></>,
                <>н. в. - <span className="font-roboto">Сегодня Sika продолжает лидировать в отрасли строительной химии, ежегодно инвестируя около 4% своего оборота в научные исследования и разработку новых технологий.</span></>,
            ],
            image: "/about/ECOVADIS-logo.png"
        },
    ]

    return (
        <div className={`main__container`}>
            <Breadcrumbs items={breadcrumbsItems} isLoading={false} />
            <div className="main__block">
                <h1 className="title mb-25">О компании</h1>
                <div className={styles.about__block}>
                    <div className={`${styles.about__block__info}`}>
                        <div className={`${styles.about__block__info__content} mb-20 p-20`}>
                            <span className="fz-16 color-red">SIKA</span> <span className="fz-16 font-roboto">- швейцарская multinational company, специализирующаяся на производстве химических материалов для строительной и автомобильной промышленности</span>
                        </div>
                        <div className={`${styles.about__block__info__content} p-20`}>
                            Основные направления <span className="font-roboto">деятельности включают разработку добавок для бетона, гидроизоляционных
                            систем, клеевых составов и ремонтных растворов. Продукция компании применяется в знаковых
                            проектах мирового масштаба, таких как небоскреб Бурдж-Халифа и Готардский базисный тоннель.</span>
                        </div>
                    </div>
                    <img className={`${styles.about__blockImg}`}/>
                </div>
            </div>
            <div className="main__block">
                <h1 className="title mb-25">История</h1>
                <Tabs tabs={tabs}/>
            </div>
            <div className="main__block">
                <h1 className="title mb-25">Достижения</h1>
                <div className={styles.about__block}>
                    <div className={`${styles.about__block__history}`}>
                        {achievements.map((item) => {
                            return <div className={`${styles.about__block__history__item} p-20`}>
                                <div className={`${styles.about__block__history__itemBlock} mb-20`}>
                                    <img
                                        src={item.logo}
                                        alt={item.text}
                                        className={`${styles.about__block__history__itemImg} ${styles[item.company]}`}
                                        loading="lazy"
                                    />
                                </div>
                                <p className="font-roboto">{item.text}</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className="main__block">
                <h1 className="title mb-25">Знаковые проекты с участием SIKA</h1>
                <div className={styles.about__block}>
                    <div className={`${styles.about__block__projects}`}>
                        <div className={`${styles.about__block__projects__item}`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
