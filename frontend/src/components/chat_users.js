import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Loader from './Loader';

// import ListGroup from 'react-bootstrap/ListGroup';
// import Tabs from 'react-bootstrap/Tabs';
// import Tab from 'react-bootstrap/Tab';
// import ReactSwipeButton from "react-swipe-button";

export default class Chat_users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: window.location.href.split("/").pop(),
            data: [],
            message: ""
        }
        this.handlesend = this.handlesend.bind(this);
    };

    async componentDidMount() {
        // this.setState({loader:true});
        await fetch("http://localhost:8080/getchat", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {


            this.setState({ data: data.data });
            // this.setState({loader:false});
        });
    }

    async componentDidUpdate() {
        // this.setState({loader:true});
        await fetch("http://localhost:8080/getchat", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {


            this.setState({ data: data.data });
            // this.setState({loader:false});
        });

    }

    handlesend() {

        fetch("http://localhost:8080/sendchat", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email: window.location.href.split("/").pop(),
                message: this.state.message,
            }),
        }).then((res) => res.json()).then((data) => {
            this.setState({ loader: false });
            this.setState({ message: "" });
        });

    }

    render() {

        // this.setState({loader:true});

        // console.log(this.state.message);
        const data = this.state?.data;
        // console.log(data)
        const email = this.state?.email;
        return (
            <>
            <div></div>
                {this.state.loader && <Loader></Loader>}

                {!this.state.loader &&
                    <div style={{
                        "top": "200px",
                        "left": "0%",
                        "marginTop": "100px",
                        "paddingBottom": "50px",
                        "display": "flex",
                        "flexDirection": "column",
                        "height": "auto",
                    }}>
                        <div style={{"display":'flex',"flexDirection":"column"}}>
                        {

                            data?.map((cvalue) => {
                                //sender
                                if (cvalue.sender === email) {
                                    return (<div class="container darker" style={{'float':"left","display":'flex',flexDirection:"row","justifyContent":"flex-start"}} >
                                   
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png" alt="Avatar" class="right" style={{ "width": "4%","borderRadius":'15px%' ,"height":'1%',float:"right","marginBottom":"2px"}} />
                                    <span style={{ "float": "left", "fontSize": "25px", "paddingLeft": "40px", "paddingRight": "40px", "marginBottom": "20px", "marginTop": "5px", "borderRadius": "0% 150px 150px 150px",backgroundColor:"black" }} className="btn-primary">{cvalue.message}</span>
                                  
                                </div>)
                                }
                                else {
                                    return (<div class="container darker" style={{'float':"right","display":'flex',flexDirection:"row","justifyContent":"flex-end"}} >
                                    <span style={{ "float": "left", "fontSize": "25px", "paddingLeft": "40px", "paddingRight": "40px", "marginBottom": "20px", "marginTop": "5px", "borderRadius": "150px 0px 150px 150px",backgroundColor:"white","color": "black" }} className="btn-primary">{cvalue.message}</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png" alt="Avatar" class="right" style={{ "width": "4%","borderRadius":'15px%' ,"height":'1%',float:"right","marginBottom":"2px", "filter":"saturate(10)", "filter":"brightness(4.5)"}} />
                                    </div>)
                                }


                            })
                        }
                        </div>
                        <div style={{ "display": "flex", "flexDirection": "row" }}>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                this.handlesend()
                            }}>

                                <textarea style={{ "width": "95%", "bottom": "0", "position": "fixed", "left": "0", "height": "30px" }} value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} required></textarea>
                                <button style={{ "bottom": "0", "position": "fixed", "right": "0" }} type="submit" className="btn-primary" onClick={(e) => {
                                    e.preventDefault()
                                    this.handlesend()
                                }}> Send </button>

                            </form>
                        </div>
                    </div>}
            </>
        )
    }


}
