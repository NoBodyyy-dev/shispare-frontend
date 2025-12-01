import {FC} from "react";
import {motion} from "framer-motion";
import styles from "./about.module.sass";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {Timeline} from "../../lib/timeline/Timeline.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";

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

    // Анимации для секций
    const fadeInUp = {
        initial: {opacity: 0, y: 50},
        whileInView: {opacity: 1, y: 0},
        viewport: {once: true, margin: "-100px"},
        transition: {duration: 0.6, ease: [0.4, 0, 0.2, 1]}
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: {once: true, margin: "-50px"}
    };

    const cardAnimation = {
        initial: {opacity: 0, y: 30, scale: 0.95},
        whileInView: {opacity: 1, y: 0, scale: 1},
        viewport: {once: true, margin: "-50px"},
        transition: {duration: 0.5, ease: [0.4, 0, 0.2, 1]}
    };

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
    ];

    const timelineItems = [
        {
            year: "1910",
            title: "Основание компании",
            description: (
                <>
                    <p>Компания <span className="color-red ">Sika</span> была основана Каспаром Винклером
                        (Kaspar Winkler) в городе Цюрих, Швейцария. Винклер, будучи инженером, разработал инновационную
                        добавку для бетона под названием <span className="color-red ">Sika-1</span>, которая
                        значительно улучшала водонепроницаемость бетонных конструкций.</p>
                    <p>Это изобретение стало революционным для строительства туннелей, мостов и других инфраструктурных
                        объектов.</p>
                </>
            )
        },
        {
            year: "1918",
            title: "Международная экспансия",
            description: (
                <p>Успех Sika-1 позволил компании начать экспорт продукции за пределы Швейцарии. Первые зарубежные
                    филиалы были открыты в Германии, Франции и Италии.</p>
            )
        },
        {
            year: "1920",
            title: "Разработка Sika-Rapid",
            description: (
                <p>Разработка <span className="color-red ">Sika-Rapid</span> – ускорителя твердения бетона.
                    Компания участвовала в восстановлении Европы после Первой мировой войны.</p>
            )
        },
        {
            year: "1963",
            title: "Революция в герметизации",
            description: (
                <p>Ознаменовался выпуском <span className="color-red ">Sikaflex®</span> - первого в мире
                    эластичного полиуретанового герметика, который нашел применение в строительстве небоскребов и
                    судостроении.</p>
            )
        },
        {
            year: "1975",
            title: "Инновационный суперпластификатор",
            description: (
                <p>Разработка <span className="color-red ">Sika® ViscoCrete</span> - инновационного
                    суперпластификатора для самоуплотняющегося бетона. Эта технология коренным образом изменила подходы
                    к бетонированию сложных конструкций.</p>
            )
        },
        {
            year: "2008",
            title: "Знаковые проекты",
            description: (
                <p>Продукты <span className="color-red ">Sika</span> использовались при строительстве самых
                    амбициозных архитектурных проектов - небоскреба Бурдж-Халифа в Дубае и стадиона "Птичье гнездо" в
                    Пекине.</p>
            )
        },
        {
            year: "2023",
            title: "Углеродная нейтральность",
            description: (
                <p>Компания представила линейку углеродно-нейтральных продуктов <span className="color-red ">Sika Terra</span>,
                    подтвердив свои амбиции достичь нулевого уровня выбросов к 2050 году.</p>
            )
        }
    ];

    const projects = [
        {
            name: "Бурдж-Халифа",
            location: "Дубай, ОАЭ",
            year: "2008-2010",
            image: "/about/projects/burj-khalifa.jpeg"
        },
        {
            name: "Тоннель под Ла-Маншем",
            location: "Франция-Великобритания",
            year: "1994",
            image: "/about/projects/tunnel.jpg"
        },
        {
            name: "Мост Золотые Ворота",
            location: "Сан-Франциско, США",
            year: "Реконструкция 2010-2015",
            image: "/about/projects/bridge.jpg"
        },
        {
            name: "Стадион Лужники",
            location: "Москва, Россия",
            year: "Реконструкция 2013-2017",
            image: "/about/projects/luzhniki.jpg"
        },
        {
            name: "Небоскреб Шанхай Тауэр",
            location: "Шанхай, Китай",
            year: "2015",
            image: "/about/projects/shanghai-tower.jpg"
        },
        {
            name: "Мост Мийо",
            location: "Франция",
            year: "2004",
            image: "/about/projects/bridge-miyo.webp"
        },
        {
            name: "Аэропорт Чанги",
            location: "Сингапур",
            year: "Разные годы",
            image: "/about/projects/airport.jpg"
        },
        {
            name: "Мост",
            location: "Международный проект",
            year: "Разные годы",
            image: "/about/projects/bridge.jpg"
        },
        {
            name: "Стадион «Птичье гнездо»",
            location: "Пекин, Китай",
            year: "2008",
            image: "/about/projects/birds-nest.jpg"
        },
        {
            name: "Готардский базисный тоннель",
            location: "Швейцария",
            year: "2016",
            image: "/about/projects/gotthard-tunnel.jpg"
        }
    ];

    return (
        <>
            <SEO
                title="О компании Sika - Лидер строительной химии"
                description="Sika - швейцарская компания, мировой лидер в производстве строительной химии. Более 100 лет инноваций в строительстве."
                keywords="Sika, строительная химия, гидроизоляция, бетон, история компании"
            />
            <div className={`main__container`}>
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>

                {/* 1. О компании Sika */}
                <motion.section 
                    className={styles.heroSection}
                    {...fadeInUp}
                >
                    <div className={styles.heroContent}>
                        <h1 className="title mb-20">О компании <span className="color-red">Sika</span></h1>
                        <div className={styles.heroDescription}>
                            <span className="color-red">Sika</span> - швейцарская multinational company,
                            специализирующаяся на производстве химических материалов для строительной и автомобильной
                            промышленности.
                            Основанная в 1910 году, компания выросла в глобального лидера с представительствами в более
                            чем 100 странах.
                        </div>
                        <div className={styles.heroDescription}>
                            Основные направления деятельности включают разработку добавок для бетона, гидроизоляционных
                            систем,
                            клеевых составов и ремонтных растворов. Продукция компании применяется в знаковых проектах
                            мирового масштаба,
                            таких как небоскреб Бурдж-Халифа и Готардский базисный тоннель.
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <div className={styles.heroImagePlaceholder}></div>
                    </div>
                </motion.section>

                <motion.section
                    className={styles.timelineSection}
                    {...fadeInUp}
                >
                    <h1 className="title mb-40">История</h1>
                    <Timeline items={timelineItems}/>
                </motion.section>

                <motion.section
                    className={styles.sikaTodaySection}
                    {...fadeInUp}
                >
                    <h1 className="title mb-20">Концерн Sika сегодня</h1>
                    <motion.div 
                        className={styles.sikaTodayGrid}
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{once: true, margin: "-50px"}}
                    >
                        <motion.div 
                            className={styles.sikaTodayCard}
                            variants={cardAnimation}
                        >
                            <p className={styles.sikaTodayText}>
                                В настоящее время <span className="color-red">Sika</span> – международный
                                концерн по производству материалов и технологий строительной химии. В состав компании
                                входят производственные предприятия, научные лаборатории, центры технической поддержки и
                                торговые представительства в более 100 странах мира. В компании работает свыше 20 000
                                сотрудников. Организационная структура концерна Sika позволяет в кратчайшие сроки решать
                                различные вопросы и обеспечивать своих заказчиков технической поддержкой. <span
                                className="color-red">Sika</span> – новатор в создании и использовании
                                многих строительных материалов и технологий. Активная позиция Sika открывает широкие
                                горизонты не только для своих сотрудников, торговых партнеров и клиентов, но и для
                                строительной индустрии в целом.
                            </p>
                        </motion.div>
                        <motion.div 
                            className={styles.sikaTodayCard}
                            variants={cardAnimation}
                        >
                            <h3 className={styles.subsectionTitle}>Sika в России</h3>
                            <p className={styles.sikaTodayText}>
                                ООО «Зика» реализует продукцию торговой марки <span
                                className="color-red">Sika</span> в России. Материалы производятся на
                                заводах в Европе и поставляются непосредственно со складов Швейцарии, Германии, Франции,
                                Италии, Польши и других стран Европейского Союза. Также Sika имеет собственные
                                производственные мощности на территории России. Основные каналы сбыта составляют прямые
                                продажи под определенные проекты и на заводы, а также диллерско-агентская сеть.
                            </p>
                            <p className={styles.sikaTodayText}>
                                В России компания работает с 2003 года и имеет 5 заводов по производству добавок в
                                бетон, 2 завода по производству сухих строительных смесей, завод по производству
                                поликарбоксилатных эфиров, завод по производству кровельных и гидроизоляционных ПВХ
                                мембран, завод по выпуску напольных эпоксидных и полиуретановых покрытий, лабораторию
                                физико-химический испытаний бетонов и бетонных смесей, химическую лабораторию и 5
                                филиалов в разных регионах страны с центральным офисом в городе Лобня Московской
                                области.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* 4. Sika для частного строительства */}
                <motion.section
                    className={styles.privateConstructionSection}
                    {...fadeInUp}
                >
                    <motion.div 
                        className={styles.privateConstructionCard}
                        variants={cardAnimation}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{once: true, margin: "-50px"}}
                    >
                        <h3 className={styles.subsectionTitle}>Sika для частного строительства и ремонтных работ</h3>
                        <p className={styles.privateConstructionText}>
                            Наш опыт — ваше преимущество. Продукты <span className="color-red ">Sika</span> —
                            это высококачественные надежные строительные материалы, проверенные более чем 100-летним
                            опытом на самых разных строительных объектах всего мира. Мы сотрудничаем не только с
                            крупными строительными и промышленными компаниями, но и с небольшими строительными фирмами.
                            Используя опыт промышленных строительных объектов, мы предлагаем оптимальные решения частным
                            пользователям, которые могут приобрести наши продукты через розничную сеть. Герметизация,
                            приклеивание, в том числе паркета, гидроизоляция, материалы для напольных покрытий, добавки
                            в бетон и раствор, сухие смеси — решения Sika применяются на любой стадии от начала до
                            завершения как строительных, так и ремонтно-отделочных работ. Единственное отличие между
                            промышленными и розничными продуктами — это размер упаковки.
                        </p>
                        <p className={styles.privateConstructionText}>
                            Материалы и решения <span className="color-red ">Sika</span>, предлагаемые для
                            частного использования, прошли проверку на профессиональных строительных объектах всего
                            мира.
                        </p>
                    </motion.div>
                </motion.section>

                <motion.section
                    className={styles.achievementsSection}
                    {...fadeInUp}
                >
                    <h2 className={styles.sectionTitle}>Достижения и награды</h2>
                    <motion.div 
                        className={styles.achievementsGrid}
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{once: true, margin: "-50px"}}
                    >
                        {achievements.map((item, index) => (
                            <motion.div
                                key={index}
                                className={styles.achievementCard}
                                variants={cardAnimation}
                            >
                                <div className={styles.achievementLogo}>
                                    <img
                                        src={item.logo}
                                        alt={item.company}
                                        className={`${styles.achievementImage} ${styles[item.company]}`}
                                        loading="lazy"
                                    />
                                </div>
                                <p className={styles.achievementText}>{item.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    className={styles.projectsSection}
                    {...fadeInUp}
                >
                    <h2 className={styles.sectionTitle}>Знаковые проекты с участием Sika</h2>
                    <motion.div 
                        className={styles.projectsGrid}
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{once: true, margin: "-50px"}}
                    >
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                className={styles.projectCard}
                                variants={cardAnimation}
                            >
                                <div className={styles.projectImage}>
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className={styles.projectImageImg}
                                        />
                                    ) : (
                                        <div className={styles.projectImagePlaceholder}></div>
                                    )}
                                    <div className={styles.projectOverlay}>
                                        <span className={styles.projectYear}>{project.year}</span>
                                    </div>
                                </div>
                                <div className={styles.projectContent}>
                                    <span>
                                        <h3 className={styles.projectName}>{project.name}</h3>
                                        <p className={styles.projectLocation}>{project.location}</p>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>
            </div>
        </>
    );
};
