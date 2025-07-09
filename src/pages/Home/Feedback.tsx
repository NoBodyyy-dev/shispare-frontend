import {useState} from "react";
import {MainInput} from "../../lib/input/MainInput.tsx";
import "./home.sass"

export const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState({
        text: ""
    });

    return (
        <div className="feedback">
            <div className="feedback__block"></div>
            <div className="feedback__block p-30">
                <form>
                    <MainInput value={feedbackData.text}
                               onChange={(e) => setFeedbackData({...feedbackData, text: e.target.value})}/>
                </form>
            </div>
        </div>
    );
};
