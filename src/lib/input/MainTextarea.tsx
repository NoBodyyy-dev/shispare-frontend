import {useRef, useEffect, TextareaHTMLAttributes, RefObject} from 'react';

const MainTextarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            if (Number(textareaRef.current.style.height.replace("px", "")) >= 200) {
                textareaRef.current.classList.add("scroll")
            } else {
                textareaRef.current.classList.remove("scroll")
            }
        }

    }, [props.value]);

    return (
        <textarea
            {...props}
            ref={textareaRef}
            rows={1}
            readOnly={false}
            className="main-textarea"
        ></textarea>
    );
};

export default MainTextarea;