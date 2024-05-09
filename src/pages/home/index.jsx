import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import "./styles.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { blogList, setBlogList, pending, setPending } = useContext(GlobalContext);
    const navigate = useNavigate();

    async function fetchListOfBlogs() {
        setPending(true);
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/blogs/all_blogs`);

        const data = await response.json();

        console.log(data);

        if (data && data.blogs && data.blogs.length) {
            setBlogList(data.blogs);
        }
        setPending(false);
    }

    async function handleDeleteBlog(getCurrentId) {
        // console.log(getCurrentId);
        if (!getCurrentId) return;
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/blogs/${getCurrentId}`,
            { method: "DELETE", }
        );

        const data = await response.json();

        console.log(data);

        if (data.status === "success") {
            fetchListOfBlogs();
        }
    }

    async function handleEdit(getCurrentBlogItem) {
        console.log(getCurrentBlogItem);
        navigate("/add-blog", { state: { getCurrentBlogItem } });
    }

    useEffect(() => {
        fetchListOfBlogs();
    }, []);

    return <div className='wrapper'>
        <h1>Blog List</h1>
        {
            pending ? <h1>Loading Blogs...</h1> :
                <div className="blogList">
                    {blogList && blogList.length ? blogList.map((blogItem, index) => <div key={blogItem._id} className="blog">
                        <div className="blog-content">
                            <h3>{blogItem.title}</h3>
                            <p>{blogItem.description}</p>
                        </div>
                        <div>
                            <FaEdit pointerEvents={index < 3 ? "none" : "auto"} onClick={() => { handleEdit(blogItem) }} cursor={"pointer"} size={30} />
                            <FaTrash pointerEvents={index < 3 ? "none" : "auto"} cursor={"pointer"} onClick={() => { handleDeleteBlog(blogItem._id) }} size={30} />

                        </div>

                    </div>
                    ) : <h3>No Blogs Added</h3>
                    }
                </div>
        }
    </div>
}