import React, { Component } from 'react'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaRedditAlien } from 'react-icons/fa'
import Loader from './Loader';
export default class Editprofile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: "",
            fname: "",
            lname: "",
            email: "",
            age: "",
            username:"",
            contact:"",

            ufname: "",
            ulname: "",
            uage: "",
            uemail: "",
            loader:false,

        };
        this.handleEdit=this.handleEdit.bind(this);
    }

    componentDidMount() {
        
        this.setState({loader:true});
        fetch("http://localhost:8080/userProfile", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        }).then((res) => res.json()).then((data) => {
            console.log(data, "userprofile"); 
            this.setState({ userData: data.data }); this.setState({ fname: data.data.fname }); this.setState({ lname: data.data.lname }); this.setState({ age: data.data.age }); this.setState({ email: data.data.email });this.setState({ username: data.data.username });this.setState({ contact: data.data.contact });
            this.setState({loader:false});
        });
    }

    handleEdit(event) {
        event.preventDefault();
        const {fname,lname,email,age} = this.state;
        // console.log(fname);
        console.log(fname, lname, email,age);
        // console.log(email);
        this.setState({loader:true});
        fetch("http://localhost:8080/edit", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                age, fname, lname, email
            }),
        }).then((res) => res.json()).then((data) => {
            console.log(data, "user logged in");
            this.setState({loader:false});
            alert(data.status);
            // alert(data.error);
            window.location.href = "/userprofile";

        });
    }


    render() {
        const { fname, lname, age,  email ,username,contact} = this.state;
        return (<>
        {this.state.loader &&<Loader></Loader>}
  {!this.state.loader &&
            <div style={{ "marginBottom": "500px" }} className='auth-inner1'>

                <div className="line">
                    <form onSubmit={this.handleEdit}>
                        <h1>Welcome to Greddit<FaRedditAlien /></h1>
                        <label></label>
                        <label> </label><input
                            type="email"
                            className="form-control"
                            value={username}
                            readOnly
                            // onChange={(e) => this.setState({ email: e.target.value })}

                        />
                        <label>First Name </label><input
                            type="fname"
                            className="form-control"
                            value={fname}
                            onChange={(e) => this.setState({ fname: e.target.value })}
                            required
                        />
                        <label>Last Name </label><input
                            type="lname"
                            className="form-control"
                            value={lname}
                            onChange={(e) => this.setState({ lname: e.target.value })}
                            required
                        />
                        <label>Email </label><input
                            type="email"
                            className="form-control"
                            value={email}
                            readOnly
                            onChange={(e) => this.setState({ email: e.target.value })}

                        />
                        <label>Contact </label><input
                            type="contact"
                            className="form-control"
                            value={contact}
                            readOnly
                            onChange={(e) => this.setState({ contact: e.target.value })}

                        />
                        <label>Age </label><input
                            type="age"
                            className="form-control"
                            value={age}

                            onChange={(e) => this.setState({ age: e.target.value })}
                            required
                        />
                        <div className="d-grid">
                            <button type="logout" className="btn btn-primary" >
                                <HiOutlineLogout />Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>}
        </>);
    }
}