import React, { Component } from 'react'
import Loader from './Loader';

import { HiUserGroup} from 'react-icons/hi'
import {  FaUserFriends} from 'react-icons/fa'
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default class Editprofile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader:false,
            show: false,
            show1: false,
            userData:[],
        };
        
      
    }

    componentDidMount() {
        this.setState({loader:true});
        fetch("http://localhost:8080/chat_users", {
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
            this.setState({ userData: data.data });
        });
    }



    render(){
        console.log(this.state.userData);
         const userData = this.state.userData;
         const handleShow = () => this.setState({ show: true });
         const handleClose = () => this.setState({ show: false });
         const handleShow1 = () => this.setState({ show1: true });
         const handleClose1 = () => this.setState({ show1: false });
        return(<>
        <div className='auth-inner2' style={{"width":"70%" ,"marginLeft":"15%"}}>
       <h1 >Aur bhai aa Gaye Baat karne ... </h1>
       <div className="line" style={{ "marginTop": "10vh","display":"flex","flexDirection":"row","flex":"flexWrap" ,"position":"absolute","float":"left","left":"0","width":"100%"}}>
                    <Button variant="primary" onClick={handleShow} className="me-2" style={{"marginLeft":"43%"}}>
                        <HiUserGroup /> Followers
                    </Button>

                    <Offcanvas show={this.state.show} onHide={handleClose} placement="start" style={{ "backgroundColor": "#e15b26" }}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title><HiUserGroup /> Followers</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          
                    {
                         this.state.userData?.map((i)=>{
                            return <div>
                            <ListGroup>
                                <ListGroup.Item> <Button onClick={()=>{window.location.href=`/chat_users/${i}`}}> 
                                                    <FaUserFriends/> {i} 
                                                 </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                         })
                    }
                        </Offcanvas.Body>
                      
                    </Offcanvas>

                   
                 </div>
        </div>
        </>
        )
    }
}