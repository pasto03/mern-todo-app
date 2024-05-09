import { useContext, useEffect } from "react";
import classes from "./styles.module.css";
import { GlobalContext } from "../../context";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddNewBlog() {
    const { formData, setFormData, isEdit, setIsEdit } = useContext(GlobalContext);
    const navigate = useNavigate();
    const location = useLocation();

    console.log(formData);

    async function handleSaveBlogToDatabase() {
        const body = { title: formData.title, description: formData.description };
        let response = null;
        if (isEdit) {
            response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/blogs/${location.state.getCurrentBlogItem._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        else {
            response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/blogs/new_blog`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }


        const data = await response.json();
        console.log(data);
        if (data) {
            setIsEdit(false);
            setFormData({
                title: "",
                description: ""
            });
            navigate("/");
        }
    }

    useEffect(() => {
        console.log(location);
        if (location.state) {
            const { getCurrentBlogItem } = location.state;
            setIsEdit(true);
            setFormData({
                title: getCurrentBlogItem.title,
                description: getCurrentBlogItem.description
            })
        }
    }, [location]);

    return <div className={classes.wrapper}>
        <h1>{isEdit ? "Edit a Blog" : "Add a Blog"}</h1>
        <div className={classes.formWrapper}>
            <input
                name="title"
                placeholder="Enter Blog Title"
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value
                })}
            />
            <textarea
                name="description"
                placeholder="Enter Blog Description"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({
                    ...formData,
                    description: e.target.value
                })}
            />
            <button onClick={handleSaveBlogToDatabase}>{isEdit ? "Edit Blog" : "Add Blog"}</button>
        </div>
    </div>
}