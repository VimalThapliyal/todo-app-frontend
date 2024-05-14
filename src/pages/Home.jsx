import axios from "axios";
import { useEffect, useState, useContext } from "react"
import { server, Context } from "../main";
import toast from "react-hot-toast";
import TodoItem from "../components/TodoItem"
import { Navigate } from "react-router-dom"


function Home() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { isAuthenticated } = useContext(Context);


    const updateHandler = async (id) => {

        try {
            const { data } = await axios.put(`${server}/tasks/${id}`, {}, {
                withCredentials: true
            })

            toast.success(data.message);
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error(error.response.data.message);

        }


    }

    const deleteHandler = async (id) => {
        try {
            const { data } = await axios.delete(`${server}/tasks/${id}`, {
                withCredentials: true
            })

            toast.success(data.message)
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error(error.response.data.message);

        }
    }

    const submitHandler = async (e) => {
        try {
            setLoading(true);
            e.preventDefault();
            const { data } = await axios.post(`${server}/tasks/new`, {
                title,
                description
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            toast.success(data.message);
            setLoading(false);
            setTitle("");
            setDescription("");
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        axios.get(`${server}/tasks/my`, {
            withCredentials: true
        }).then((res) => {
            setTasks(res.data.tasks)
        }).catch(error => {
            toast.error(error.response.data.message);
        })
    }, [refresh])


    if (!isAuthenticated) return <Navigate to={"/login"} />


    return (
        <div className="container">
            <div className="login">
                <section>
                    <form onSubmit={submitHandler}>
                        <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Title" />
                        <input required value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="Description" />

                        <button disabled={loading} type="submit">Add Task</button>

                    </form>
                </section>
            </div>


            <section className="todosContainer">
                {
                    tasks.map((task) => (<TodoItem key={task._id} id={task._id} title={task.title} description={task.description} updateHandler={updateHandler} deleteHandler={deleteHandler} isCompleted={task.isCompleted} />))
                }
            </section>


        </div>
    )
}

export default Home