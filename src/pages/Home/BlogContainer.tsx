import {Post} from "../Blog/Post.tsx";
import {Link} from "react-router-dom";
import {Button} from "../../lib/buttons/Button.tsx";
import {useEffect} from "react";
import {getAllPostsFunc} from "../../store/actions/blog.action.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";

export const BlogContainer = () => {
    const dispatch = useAppDispatch();
    const {posts} = useAppSelector(state => state.blog);

    useEffect(() => {
        dispatch(getAllPostsFunc());
    }, []);

    return <div className="main__block home__block">
        <h1 className="title mb-25">Блог</h1>
        <div className="home__blog mb-20">
            {posts.map((post) => {
                return <Post key={post._id} {...post} />
            })}
        </div>
        {posts.length > 3 &&
            <div className="full-width flex-to-center">
                <Link to="/blog">
                    <Button>Читать еще</Button>
                </Link>
            </div>
        }
    </div>
}