import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs";
import MainMap from "../../lib/Map/Map";
import "./contacts.sass";
import {FC} from "react";

export const Contacts: FC = () => {
    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/contacts`, label: "Контакты"},
    ];

    return (
        <div className="main__container contacts">
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <h1 className="title mb-25">Свяжитесь с нами</h1>
            <div className="contacts__container top gap-20 mb-20">
                <div className="contacts__block p-15">
                    <p className="fz-20 mb-5">
                        Официальный поставщик материалов строительной химии швейцарского
                        концерна <span className="color-red">Sika®</span>
                    </p>
                    <p className="fz-14 font-roboto">
                        на территории Южного и Северо-Кавказского федеральных округов,
                        республики Крым <p className="color-blue">ООО «ШИСПАР»</p>
                    </p>
                </div>
                <a href="/files/certificate.pdf" target="_blank" rel="noopener noreferrer">
                    <div className="contacts__block certificate"/>
                </a>
            </div>
            <div className="contacts__container bottom gap-20">
                <div className="contacts__block flex-align-center gap-10 phone p-15">
                    <div className="contacts__block-circle"></div>
                    <span className="contacts__block__info">
            <p className="fz-18">Телефон</p>
            <p className="font-roboto fz-14">+7 (988) 312-14-14</p>
          </span>
                </div>
                <div className="contacts__block flex-align-center gap-10 email p-15">
                    <div className="contacts__block-circle"></div>
                    <span className="contacts__block__info">
            <p className="fz-18">Почта</p>
            <p className="font-roboto fz-14">shispare@yandex.ru</p>
          </span>
                </div>
                <div className="contacts__block flex-align-center gap-10 address p-15">
                    <div className="contacts__block-circle"></div>
                    <span className="contacts__block__info">
            <p className="fz-18">Адрес</p>
            <p className="font-roboto fz-14">г. Краснодар, ул. Кирпичная 1/2</p>
          </span>
                </div>
            </div>
            <MainMap geomX={38.859358} geomY={45.047813} showInfo={false}/>
        </div>
    );
}
