import React, {Component} from "react";
import Modal from "./components/Modal"
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            todoList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
                completed: false
            }
        };
    }

    componentDidMount() { // Called immediately after a component is mounted. (when component is loaded and ready)
        this.refreshList();
    }

    refreshList = () => {
        axios.get("/api/todos/") //Makes get request to our backend
            .then((res) => this.setState({todoList: res.data})) //setState does refresh page with result of our database
            .catch((err) => console.error(err));
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    handleSubmit = (item) => {
        this.toggle();

        if(item.id){ // If item has already an id, means it already exists in the database, so we are doing an update below
            axios.put(`/api/todos/${item.id}/`, item) // put request to make an update
                .then(() => this.refreshList()) // and then refresh the list
                .catch((err) => console.log(err));
            return;
        }

        axios.post("/api/todos/", item) // if there is no id, means this item does not exist in the database
            .then(() => this.refreshList())
            .catch((err) => console.error(err));
    };

    handleDelete = (item) => {
        axios.delete(`/api/todos/${item.id}/`)
            .then(() => this.refreshList())
            .catch((err) => console.error(err));
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false};

        this.setState({activeItem: item, modal: !this.state.modal});
    };

    editItem = (item) => {
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    displayCompleted = (status) => {
        return this.setState({viewCompleted: status}); // Change viewCompleted state to false
    };

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewCompleted ? "nav-link active" : "nav-link"} //Ternary operator to change if nav link is active when viewCompleted is false or not.
                    onClick={() => this.displayCompleted(true)}>Complete</span>
                <span
                    className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => this.displayCompleted(false)}>Incomplete</span>
            </div>
        );
    };

    renderItems = () => {
        const {viewCompleted} = this.state; //Gets viewCompleted variable from current state
        const newItems = this.state.todoList.filter((item) => item.completed === viewCompleted); //Arrow function to filter items by completion depending on viewCompleted

        return newItems.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center">
                <span className={`todo-title me-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
                      title={item.description}>
                  {item.title}
                </span>
                <span>
                    <button className="btn btn-secondary me-2" onClick={() => this.editItem(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>Delete</button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="container">
                <h1 className="text-black text-uppercase text-center my-4">Todo app</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="mb-4">
                                <button className="btn btn-primary" onClick={this.createItem}>Add task</button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* We are calling Modal component to render with parameters */}
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }
}

export default App;