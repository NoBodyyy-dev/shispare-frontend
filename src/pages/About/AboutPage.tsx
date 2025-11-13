import styles from "./about.module.sass"
import Timeline from "../../lib/timeline/Timeline.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {FC} from "react";
import {motion, useReducedMotion} from "framer-motion";
import {FaBuilding, FaMapMarkerAlt, FaHome} from "react-icons/fa";

export const About: FC = () => {
    const prefersReducedMotion = useReducedMotion();
    
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

    const containerVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.15,
                delayChildren: prefersReducedMotion ? 0 : 0.05,
                duration: prefersReducedMotion ? 0 : 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.4,
                ease: [0.4, 0, 0.2, 1] as any
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: [0.4, 0, 0.2, 1] as any
            }
        },
        hover: {
            scale: prefersReducedMotion ? 1 : 1.02,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: [0.4, 0, 0.2, 1] as any
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 1.05 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: [0.4, 0, 0.2, 1] as any
            }
        },
        hover: {
            scale: prefersReducedMotion ? 1 : 1.08,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: [0.4, 0, 0.2, 1] as any
            }
        }
    };

    const achievements = [
        {
            logo: "/about/DJSI-logo.png",
            text: "Включение в индекс устойчивого развития Dow Jones Sustainability Index (DJSI) - признание лидерства в области устойчивого развития и корпоративной ответственности.",
            company: "DJSI"
        },
        {
            logo: "/about/CDP-logo.png", 
            text: "Высшая оценка 'A' от CDP (Carbon Disclosure Project) за прозрачность и эффективность в борьбе с изменением климата. Сокращение выбросов CO₂ на 26%.",
            company: "CDP"
        },
        {
            logo: "/about/ECOVADIS-logo.png",
            text: "Платиновый рейтинг EcoVadis - высшая оценка за достижения в области корпоративной социальной ответственности, экологии и устойчивого развития.",
            company: "ECOVADIS"
        },
        {
            logo: "/about/RD100-logo.png", 
            text: "Престижная награда R&D 100 за инновационные разработки в области строительной химии и передовых технологий.",
            company: "RD100"
        },
        {
            logo: "/about/ST-logo.png", 
            text: "Награда за разработку высокоэффективной клеевой технологии Sikaflex®, революционизировавшей индустрию строительства и производства.",
            company: "ST"
        },
        {
            logo: "/about/GPTW-logo.png", 
            text: "Признание Great Place to Work® - одна из лучших компаний для работы, обеспечивающая отличные условия труда и развитие сотрудников.",
            company: "GPTW"
        },
    ]

    const projects = [
        {
            id: 1,
            title: "Бурдж-Халифа",
            location: "Дубай, ОАЭ (2008-2010)",
            description: "Самое высокое здание в мире (828 м). Продукты Sika использовались для гидроизоляции, герметизации и укрепления бетонных конструкций.",
            image: "/about/projects/burj-khalifa.jpg"
        },
        {
            id: 2,
            title: "Готардский базисный тоннель",
            location: "Швейцария (1999-2016)",
            description: "Самый длинный железнодорожный тоннель в мире (57 км). Sika обеспечила инъекционные материалы и гидроизоляцию.",
            image: "/about/projects/gotthard-tunnel.jpg"
        },
        {
            id: 3,
            title: "Стадион \"Птичье гнездо\"",
            location: "Пекин, Китай (2008)",
            description: "Главный стадион Олимпийских игр 2008. Применены клеевые системы и герметики Sika для стальных конструкций.",
            image: "/about/projects/birds-nest.jpg"
        },
        {
            id: 4,
            title: "Мост Золотые Ворота",
            location: "Сан-Франциско, США (реконструкция)",
            description: "Реконструкция знаменитого моста с использованием защитных покрытий и ремонтных материалов Sika.",
            image: "/about/projects/golden-gate.jpg"
        },
        {
            id: 5,
            title: "Тоннель под Ла-Маншем",
            location: "Великобритания-Франция (1994)",
            description: "Подводный железнодорожный тоннель. Sika поставила инъекционные материалы для герметизации и укрепления.",
            image: "/about/projects/channel-tunnel.jpg"
        },
        {
            id: 6,
            title: "Небоскреб Шанхай Тауэр",
            location: "Шанхай, Китай (2015)",
            description: "Второй по высоте небоскреб в мире (632 м). Применены системы гидроизоляции и герметизации Sika.",
            image: "/about/projects/shanghai-tower.jpg"
        },
        {
            id: 7,
            title: "Мост Мийо",
            location: "Франция (2004)",
            description: "Самый высокий мост в мире (343 м). Использованы специальные добавки для бетона и защитные покрытия Sika.",
            image: "/about/projects/millau-bridge.jpg"
        },
        {
            id: 8,
            title: "Стадион \"Лужники\"",
            location: "Москва, Россия (реконструкция 2018)",
            description: "Реконструкция к Чемпионату мира по футболу. Применены гидроизоляционные системы и клеевые составы Sika.",
            image: "/about/projects/luzhniki.jpg"
        },
        {
            id: 9,
            title: "Аэропорт Чанги",
            location: "Сингапур (расширение)",
            description: "Один из лучших аэропортов мира. Sika обеспечила полную гидроизоляцию и защиту бетонных конструкций.",
            image: "/about/projects/changi-airport.jpg"
        }
    ]

    const timelineItems = [
        {
            id: "timeline1",
            year: "1910-1930",
            content: [
                <>1910 - <span className="font-roboto">Основание компании <span className="color-red">Sika</span> Каспаром Винклером в Цюрихе. Разработка инновационной добавки Sika-1 для водонепроницаемости бетона.</span></>,
                <>1918 - <span className="font-roboto">Начало экспорта продукции. Открытие филиалов в Германии, Франции и Италии.</span></>,
                <>1920 - <span className="font-roboto">Разработка Sika-Rapid – ускорителя твердения бетона. Участие в восстановлении Европы после Первой мировой войны.</span></>
            ],
        },
        {
            id: "timeline2",
            year: "1930-1945",
            content: [
                <>1930 - <span className="font-roboto">Преодоление экономического кризиса. Разработка антикоррозионных покрытий для стальных конструкций.</span></>,
                <>1939-45 - <span className="font-roboto">Обеспечение ремонта критически важной инфраструктуры в период Второй мировой войны. Продолжение научных исследований.</span></>,
            ],
        },
        {
            id: "timeline3",
            year: "1945-1970",
            content: [
                <>1950 - <span className="font-roboto">Выход на рынки Северной и Южной Америки. Представление линейки строительных клеев <span className="color-red">SikaBond®</span>.</span></>,
                <>1963 - <span className="font-roboto">Выпуск Sikaflex® - первого эластичного полиуретанового герметика. Открытие производства в Японии в 1968 году.</span></>
            ],
        },
        {
            id: "timeline4",
            year: "1970-2000",
            content: [
                <>1975 - <span className="font-roboto">Разработка <span className="color-red">Sika® ViscoCrete</span> - инновационного суперпластификатора для самоуплотняющегося бетона.</span></>,
                <>1989 - <span className="font-roboto">Приобретение таиландской компании Thaicoat. Представление первой линейки материалов с пониженным содержанием VOC.</span></>
            ],
        },
        {
            id: "timeline5",
            year: "2000-н.в.",
            content: [
                <>2008 - <span className="font-roboto">Участие в строительстве Бурдж-Халифа и стадиона "Птичье гнездо". Приобретение MBCC Group в 2016 году.</span></>,
                <>2023 - <span className="font-roboto">Представление линейки углеродно-нейтральных продуктов Sika Terra. Цель - нулевой уровень выбросов к 2050 году.</span></>,
                <>н. в. - <span className="font-roboto">Лидерство в отрасли. Инвестиции около 4% оборота в научные исследования и разработку новых технологий.</span></>,
            ],
        },
    ]

    return (
        <motion.div 
            className={`main__container`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <motion.div className="main__block" variants={itemVariants}>
                <motion.h1 
                    className="title mb-25"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    О компании
                </motion.h1>
                <div className={styles.about__block}>
                    <motion.div 
                        className={`${styles.about__block__info}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div 
                            className={`${styles.about__block__info__content} mb-20 p-20`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(239, 59, 38, 0.15)" }}
                        >
                            <span className={`fz-16 ${styles.highlightRed}`}>SIKA</span> <span className="fz-16 font-roboto">- швейцарская multinational company, специализирующаяся на производстве химических материалов для строительной и автомобильной промышленности. Основанная в 1910 году, компания выросла в глобального лидера с более чем 27 000 сотрудников и представительствами в более чем 100 странах мира.</span>
                        </motion.div>
                        <motion.div 
                            className={`${styles.about__block__info__content} mb-20 p-20`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0, 69, 139, 0.15)" }}
                        >
                            Основные направления <span className="font-roboto">деятельности включают разработку добавок для бетона, гидроизоляционных
                            систем, клеевых составов и ремонтных растворов. Продукция компании применяется в знаковых
                            проектах мирового масштаба, таких как небоскреб Бурдж-Халифа и Готардский базисный тоннель.</span>
                        </motion.div>
                        <motion.div 
                            className={`${styles.about__block__info__content} p-20`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(239, 59, 38, 0.15)" }}
                        >
                            <span className="font-roboto">Компания Sika инвестирует более 4% своего оборота в научные исследования и разработки, что позволяет ей оставаться на переднем крае инноваций в строительной химии. Ежегодно Sika регистрирует более 100 патентов, подтверждая свой статус технологического лидера отрасли.</span>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className={`${styles.about__blockImg}`}
                        variants={imageVariants}
                        whileHover="hover"
                    />
                </div>
            </motion.div>
            {/*<motion.div */}
            {/*    className="main__block"*/}
            {/*    variants={itemVariants}*/}
            {/*    initial="visible"*/}
            {/*    whileInView="visible"*/}
            {/*    viewport={{ once: true, amount: 0.2, margin: "-50px" }}*/}
            {/*    style={{overflow: 'visible', position: 'relative'}}*/}
            {/*>*/}
            {/*    <motion.h1 */}
            {/*        className="title mb-25"*/}
            {/*        initial={{ opacity: 1, x: -30 }}*/}
            {/*        whileInView={{ opacity: 1, x: 0 }}*/}
            {/*        viewport={{ once: true }}*/}
            {/*        transition={{ duration: 0.6 }}*/}
            {/*    >*/}
            {/*        История <span className={styles.highlightRed}>компании</span>*/}
            {/*    </motion.h1>*/}
            {/*    <div style={{*/}
            {/*        width: '100%', */}
            {/*        overflow: 'visible', */}
            {/*        position: 'relative', */}
            {/*        zIndex: 1,*/}
            {/*        minHeight: '800px',*/}
            {/*        backgroundColor: 'transparent'*/}
            {/*    }}>*/}
            {/*        <Timeline items={timelineItems}/>*/}
            {/*    </div>*/}
            {/*</motion.div>*/}
            <motion.div 
                className="main__block"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            >
                <motion.div 
                    className={styles.about__infoCard}
                    variants={itemVariants}
                    whileHover={{ y: prefersReducedMotion ? 0 : -4 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className={styles.about__infoCard__icon}>
                        <FaBuilding />
                    </div>
                    <h2 className={styles.about__infoCard__title}>
                        Концерн <span className={styles.highlightRed}>Sika</span> сегодня
                    </h2>
                    <div className={styles.about__infoCard__content}>
                        <p className="font-roboto fz-16">
                            В настоящее время <span className={styles.highlightRed}>Sika</span> – международный концерн по производству материалов и технологий строительной химии. В состав компании входят производственные предприятия, научные лаборатории, центры технической поддержки и торговые представительства в более 100 странах мира. В компании работает свыше 20 000 сотрудников.
                        </p>
                        <p className="font-roboto fz-16 mt-15">
                            Организационная структура концерна <span className={styles.highlightRed}>Sika</span> позволяет в кратчайшие сроки решать различные вопросы и обеспечивать своих заказчиков технической поддержкой. <span className={styles.highlightRed}>Sika</span> – новатор в создании и использовании многих строительных материалов и технологий. Активная позиция <span className={styles.highlightRed}>Sika</span> открывает широкие горизонты не только для своих сотрудников, торговых партнеров и клиентов, но и для строительной индустрии в целом.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className="main__block"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            >
                <motion.div 
                    className={styles.about__infoCard}
                    variants={itemVariants}
                    whileHover={{ y: prefersReducedMotion ? 0 : -4 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className={styles.about__infoCard__icon}>
                        <FaMapMarkerAlt />
                    </div>
                    <h2 className={styles.about__infoCard__title}>
                        <span className={styles.highlightRed}>Sika</span> в России
                    </h2>
                    <div className={styles.about__infoCard__content}>
                        <p className="font-roboto fz-16">
                            ООО «Зика» реализует продукцию торговой марки <span className={styles.highlightRed}>Sika</span> в России. Материалы производятся на заводах в Европе и поставляются непосредственно со складов Швейцарии, Германии, Франции, Италии, Польши и других стран Европейского Союза. Также <span className={styles.highlightRed}>Sika</span> имеет собственные производственные мощности на территории России. Основные каналы сбыта составляют прямые продажи под определенные проекты и на заводы, а также диллерско-агентская сеть.
                        </p>
                        <p className="font-roboto fz-16 mt-15">
                            В России компания работает с 2003 года и имеет 5 заводов по производству добавок в бетон, 2 завода по производству сухих строительных смесей, завод по производству поликарбоксилатных эфиров, завод по производству кровельных и гидроизоляционных ПВХ мембран, завод по выпуску напольных эпоксидных и полиуретановых покрытий, лабораторию физико-химический испытаний бетонов и бетонных смесей, химическую лабораторию и 5 филиалов в разных регионах страны с центральным офисом в городе Лобня Московской области.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className="main__block"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            >
                <motion.div 
                    className={styles.about__infoCard}
                    variants={itemVariants}
                    whileHover={{ y: prefersReducedMotion ? 0 : -4 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className={styles.about__infoCard__icon}>
                        <FaHome />
                    </div>
                    <h2 className={styles.about__infoCard__title}>
                        <span className={styles.highlightRed}>Sika</span> для частного строительства и ремонтных работ
                    </h2>
                    <div className={styles.about__infoCard__content}>
                        <p className="font-roboto fz-16">
                            <strong>Наш опыт — ваше преимущество.</strong> Продукты <span className={styles.highlightRed}>Sika</span> — это высококачественные надежные строительные материалы, проверенные более чем 100-летним опытом на самых разных строительных объектах всего мира. Мы сотрудничаем не только с крупными строительными и промышленными компаниями, но и с небольшими строительными фирмами.
                        </p>
                        <p className="font-roboto fz-16 mt-15">
                            Используя опыт промышленных строительных объектов, мы предлагаем оптимальные решения частным пользователям, которые могут приобрести наши продукты через розничную сеть. Герметизация, приклеивание, в том числе паркета, гидроизоляция, материалы для напольных покрытий, добавки в бетон и раствор, сухие смеси — решения <span className={styles.highlightRed}>Sika</span> применяются на любой стадии от начала до завершения как строительных, так и ремонтно-отделочных работ. Единственное отличие между промышленными и розничными продуктами — это размер упаковки.
                        </p>
                        <p className="font-roboto fz-16 mt-15">
                            Материалы и решения <span className={styles.highlightRed}>Sika</span>, предлагаемые для частного использования, прошли проверку на профессиональных строительных объектах всего мира.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className="main__block"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            >
                <motion.h1 
                    className="title mb-25"
                    initial={{ opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                    Достижения
                </motion.h1>
                <motion.div 
                    className={styles.about__block}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15, margin: "-30px" }}
                >
                    <div className={`${styles.about__block__info__history}`}>
                        {achievements.map((item, index) => (
                            <motion.div 
                                key={item.company}
                                className={`${styles.about__block__info__history__item}`}
                                variants={cardVariants}
                                whileHover={{ y: prefersReducedMotion ? 0 : -8 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <motion.div 
                                    className={`${styles.about__block__info__history__itemBlock}`}
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                                    transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <img
                                        src={item.logo}
                                        alt={item.text}
                                        className={`${styles.about__block__info__history__itemImg} ${styles[item.company]}`}
                                        loading="lazy"
                                    />
                                </motion.div>
                                <p className="font-roboto">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                className="main__block"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h1 
                    className="title mb-25"
                    initial={{ opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                    Знаковые проекты с участием <span className={styles.highlightRed}>SIKA</span>
                </motion.h1>
                <motion.div 
                    className={`${styles.about__block} ${styles.about__block__projects}`}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {projects.map((project, index) => (
                        <motion.div 
                            key={project.id} 
                            className={`${styles.about__block__projects__item}`}
                            variants={cardVariants}
                            whileHover="hover"
                            custom={index}
                        >
                            <motion.div 
                                className={styles.project__image}
                                variants={imageVariants}
                                whileHover="hover"
                            >
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/no-image.svg";
                                    }}
                                />
                            </motion.div>
                            <div className="p-20">
                                <h3 className={styles.project__title}>{project.title}</h3>
                                <p className={`font-roboto fz-14 ${styles.project__location}`}>{project.location}</p>
                                <p className="font-roboto fz-14 mt-10">{project.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
