import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiUserGroup, HiOutlineLogout} from 'react-icons/hi'
import { BiMessageSquareEdit } from 'react-icons/bi'
import { FaRedditAlien, FaUserFriends} from 'react-icons/fa'
import ListGroup from 'react-bootstrap/ListGroup';
import Loader from './Loader';

// import { Button ,ButtonGroup} from '@mui/material';
// import { ButtonGroup } from '@mui/material';

export default class Userprofile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: "",
            show: false,
            show1: false,
            data:[],
            loader:false,
        };
    }

    componentDidMount() {
        this.setState({loader:true});
        fetch("http://localhost:8080/UserProfile", {
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
            console.log(data, "userprofile"); this.setState({ userData: data.data });
            this.setState({loader:false});
        });
    }

   handleremove(email)
   {
    this.setState({loader:true});
        fetch("http://localhost:8080/removefollower", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email,
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log(data, "userprofile"); this.setState({ userData: data.data });
            window.location.reload(false);
            this.setState({loader:false});
        });
     
   }
   handleremove1(email)
   {
    this.setState({loader:true});
        fetch("http://localhost:8080/removefollowing", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email,
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log(data, "userprofile"); this.setState({ userData: data.data });
            window.location.reload(false);
            this.setState({loader:false});
        });
     
   }

    render() {
        // this.setState({loader:true});
        fetch("http://localhost:8080/Userprofile", {
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
            // console.log(data, "userprofile");
             this.setState({ userData: data.data });

        });
        const handleLogout = () => {
            console.log("in logout");
            window.localStorage.clear();
            window.location.reload(false);
            window.location.href = "/sign-in"
        }

        const handleShow = () => this.setState({ show: true });
        const handleClose = () => this.setState({ show: false });
        const handleShow1 = () => this.setState({ show1: true });
        const handleClose1 = () => this.setState({ show1: false });
        const handleEdit=()=> window.location.href = "/edit"

        return (
            <>
  {this.state.loader &&<Loader></Loader>}
  {!this.state.loader && 
    <div style={{ "marginBottom": "500px" }} className='auth-inner1'>
                <div className="line">
                    <h1>Welcome to Greddit<FaRedditAlien /></h1><hr />
                    <button style={{ "marginLeft": "350px" }} onClick={handleEdit}><BiMessageSquareEdit /></button><br></br>
                    Username<h2>{this.state.userData.username}</h2>
                    Name <h2>{this.state.userData.fname + this.state.userData.lname}</h2>
                    Email <h2>{this.state.userData.email}</h2>
                    Contact <h2>{this.state.userData.contact}</h2>
                    Age <h2>{this.state.userData.age}</h2>
                    <div className="d-grid">
                        <button type="logout" className="btn btn-primary" onClick={handleLogout}>
                            <HiOutlineLogout></HiOutlineLogout>Logout
                        </button>
                    </div>
                </div>
                <div className="line" style={{ "marginTop": "10vh","display":"flex","flexDirection":"row","flex":"flexWrap" }}>
                    <Button variant="primary" onClick={handleShow} className="me-2">
                        <HiUserGroup /> Followers
                    </Button>
                    <Button variant="primary" onClick={handleShow1} className="me-2" style={{ "marginLeft": "200px" }}>
                        <HiUserGroup /> Following
                    </Button>

                    <Offcanvas show={this.state.show} onHide={handleClose} placement="start" style={{ "backgroundColor": "#e15b26" }}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title><HiUserGroup /> Followers</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {
                                // console.log(this.state.userData.followings)
                            }
                    {
                         this.state.userData.followers?.map((i)=>{
                            return <div>
                            <ListGroup>
                                <ListGroup.Item><FaUserFriends></FaUserFriends> {i}<button className='btn-primary' style={{"float":"right"}} onClick={(e) => {
                                        e.preventDefault()
                                        this.handleremove(i)
                                    }}>Remove</button></ListGroup.Item>
                            </ListGroup>
                        </div>
                         })
                    }
                        </Offcanvas.Body>
                      
                    </Offcanvas>

                    <Offcanvas show={this.state.show1} onHide={handleClose1} placement="end" style={{ "backgroundColor": "#e15b26" }}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title><HiUserGroup /> Following</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        {
                         this.state.userData.followings?.map((i)=>{
                            return <div>
                            <ListGroup>
                                <ListGroup.Item><FaUserFriends></FaUserFriends> {i}<button className='btn-primary' style={{"float":"right"}} onClick={(e) => {
                                        e.preventDefault()
                                        this.handleremove1(i)
                                    }}>Remove</button></ListGroup.Item>
                               
                            </ListGroup>
                        </div>
                         })
                    }
                        </Offcanvas.Body>
                    </Offcanvas>
                 </div>
            </div>}
</>
        );
    }

}