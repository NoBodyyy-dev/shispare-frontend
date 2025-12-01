import styles from "./blog.module.sass";
import {PostInterface} from "../../store/interfaces/blog.interface.ts";
import {Link} from "react-router-dom";
import {useHandleDate} from "../../hooks/util.hook.ts";

export const Post = (props: PostInterface) => {
    const handleDate = useHandleDate();
    const post = {...props}

    return <Link to={`/blog/${post.slug}`}>
        <div className={`${styles.post} p-20`} key={post._id}>
            <img src={post.image} alt={post.title}/>
            <div className={styles.content}>
                <p className="color-gray fz-12 mt-10 mb-10">{handleDate(post.updatedAt!)}</p>
                <h2 className="subtitle mb-5">{post.title}</h2>
                <p className={`${styles.description} fz-14 font-roboto color-gray fz-10`}>{post.content}</p>
            </div>
        </div>
    </Link>
}