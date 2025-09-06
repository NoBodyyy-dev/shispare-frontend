import React from "react";
import {useForm} from "react-hook-form";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {createPostHandler} from "../../store/handlers/blog.handler.ts";
import {createPostFunc} from "../../store/actions/blog.action.ts";

type FormValues = {
    title: string;
    content: string;
    image: FileList;
};


export const CreatePostForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const {register, handleSubmit, reset} = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        dispatch(createPostFunc({
            title: data.title,
            content: data.content,
            image: data.image,
        }));
        reset();
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Создать пост</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Заголовок"
                    {...register("title", {required: true})}
                    className="border p-2 rounded-lg"
                />
                <textarea
                    placeholder="Контент"
                    {...register("content", {required: true})}
                    className="border p-2 rounded-lg min-h-[100px]"
                />
                <input
                    type="file"
                    accept="image/*"
                    {...register("image", {required: true})}
                    className="border p-2 rounded-lg"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                    Создать пост
                </button>
            </form>
        </div>
    );
};