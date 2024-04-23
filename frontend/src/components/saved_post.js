import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup'
import { AiFillLike, AiFillDislike, AiOutlineComment } from 'react-icons/ai'
import { GoReport } from 'react-icons/go'
import { FaUserCircle } from 'react-icons/fa'
import Accordion from '../Accordion';
import {BsBookmarkPlus} from 'react-icons/bs'
import Loader from './Loader';

export default class Saved extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_all: [],
            loader:false,
        }
        this.handlepost = this.handlepost.bind(this);
        this.handlelike = this.handlelike.bind(this);
        this.handlesave = this.handlesave.bind(this);
        this.handlefollow = this.handlefollow.bind(this);
        this.handledislike = this.handledislike.bind(this);
        this.handlecomment = this.handlecomment.bind(this);
    };

    componentDidMount() {
        this.setState({ loader: true });
        fetch("http://localhost:8080/fetchsavedpost", {
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
            // console.log(data.data);
            this.setState({ data: data.data });
       
        });
       
        fetch("http://localhost:8080/fetchallpost", {
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
            // console.log(data.data);
            this.setState({ data_all: data.data });
        });
        this.setState({ loader: false });
    }

    componentDidUpdate() {

    }
    handlelike(e, postid) {
        e.preventDefault();
        this.setState({ loader: true });
        fetch("http://localhost:8080/like", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id:"123",
                postid,
            }),
        }).then((res) => res.json()).then((data) => {

            // this.setState({ post: data.data });
            window.location.reload(false);
            this.setState({ loader: false });
        });
    }
    handledislike(e, postid) {
        e.preventDefault();
        this.setState({ loader: true });
        fetch("http://localhost:8080/dislike", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: "123",
                postid,
            }),
        }).then((res) => res.json()).then((data) => {

            //   this.setState({ post: data.data });
            this.setState({ loader: false });
            window.location.reload(false);
        });
    }

    handlecomment(cvalue) {
        // const postid = cvalue;
        // console.log(cvalue);
        this.setState({ loader: true });
        fetch("http://localhost:8080/comment", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id:"123",
                comment: this.state.comment,
                postid: cvalue,
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log("ok");
            if (data.status === "ok")
                alert("comment posted")

        });
        // console.log(cvalue);
        window.location.reload(false);
        this.setState({ loader: false });
    }

    handlefollow(e, cvalue) {
        e.preventDefault();
        const email = cvalue;
        // console.log(email)
        this.setState({ loader: true });
        fetch("http://localhost:8080/userfollow", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                email
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log("ok");
            this.setState({ loader: false });
            alert(data.status);

        });
        // //   console.log(cvalue);
        // window.location.reload(false)
    }
    handlepost(event, Banned) {
        event.preventDefault();
        // console.log(this.state.content,Banned);
        const str = this.state.content;
        let newstr = "";
        let arr = [];
        arr = str.split(" ")
        Banned.map((i) => {
            for (let j = 0; j < arr.length; j++) {
                // console.log(arr[j]?.toLowerCase()===i?.toLowerCase());
                if (arr[j]?.toLowerCase() === i?.toLowerCase()) {
                    arr[j] = "*";
                }
            }
            // return arr = str.split(i);
            return arr;
        })
        if (arr.includes("*")) {
            alert("used banned keyword will be replaced by *")
        }

        for (let i of arr) {
            newstr = newstr.concat(" ", i)
        }
        newstr = newstr.slice(1);
        // console.log(arr, newstr);
        this.setState({ content: newstr })
        this.setState({ loader: true });
        fetch("http://localhost:8080/posted", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id:"123",
                token: window.localStorage.getItem("token"),
                content: newstr,
            }),
        }).then((res) => res.json()).then((data) => {
            window.location.reload(false);
            if (data.status === "ok") {
                alert(" msg posted")
            }
        });
        this.setState({ loader: false });
    }
    handlesave(e, postid) {
        e.preventDefault();
        console.log(postid);
        this.setState({ loader: true });
        fetch("http://localhost:8080/save", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: "123",
                postid,
            }),
        }).then((res) => res.json()).then((data) => {

            if (data.status === "ok") {
                this.setState({ saved: !this.state.saved });
                alert("Post saved")
            }
            else {
                alert(data.status)
            }
            window.location.reload(false);
        });
        this.setState({ loader: false });
    }
    render() {
        const { data_all, data } = this.state;
        console.log( data.saved);
        return (
            <div style={{"marginTop":"100px"}}>
<h1>Your Saved Post</h1>
{this.state.loader &&<Loader></Loader>}
  {!this.state.loader &&
                    data_all?.filter((cvalue) => {

                        for (let i of data?.saved) {
                            if (i === cvalue._id) {
                                return cvalue
                            }
                        }

                        return false;
                    })?.map((cvalue) => {
                        return (
                            <div>
                                <div className="card" style={{ "width": "100%", " marginLeft": "140px", "marginTop": "20px", "backgroundColor": "" }}>
                                    <div className="card-body" style={{}}>
                                        <h5 style={{ textAlign: "left" }} className="card-title">{cvalue.sname}</h5>
                                        <ul className="list-group" style={{ textAlign: "left" }}>
                                            <button className="btn btn-primary" style={{ "textAlign": "center", "marginLeft": "10px", "height": "30px" }} onClick={(e) => this.handlesave(e, cvalue._id)}><BsBookmarkPlus />Unsave Post</button>

                                            <li className="list-group-item">
                                                {cvalue.post}
                                                <label style={{ "display": "flex", "justifyContent": "right", "alignItems": "center" }}>
                                                    <i> ~ </i> <b><i><u><FaUserCircle />{cvalue.postedby}</u></i></b>
                                                    <button className="btn btn-primary" style={{ "textAlign": "center", "marginLeft": "10px", "height": "30px" }} onClick={(e) => this.handlefollow(e, cvalue.postedby)}>Follow</button>

                                                </label>
                                            </li>
                                        </ul>
                                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={(e) => { this.handlelike(e, cvalue._id) }}><AiFillLike />{cvalue.liked?.length}</button >
                                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={(e) => { this.handledislike(e, cvalue._id) }}><AiFillDislike />{cvalue.disliked?.length}</button>
                                        <button className="btn btn-secondary" style={{ margin: "10px" }}><GoReport />Report</button>
                                        <button onClick={() => this.setState({ clicked1: !this.state.clicked1 })} className="btn btn-secondary" style={{ margin: "10px" }}><AiOutlineComment />" "Comments</button>
                                        {/* <label>{cvalue.comment.map((item)=>{
                           return <h1>{item.msg}</h1>
                          })}</label> */}
                                        {this.state.clicked1 && (
                                            <form >

                                                <button onClick={() => this.setState({ clicked1: false })} type='new' className="btn btn-primary" style={{ "marginTop": "0px", "marginLeft": "340px" }}>X</button>
                                                <div>
                                                    <label><h2>Comments</h2></label>
                                                    {
                                                        cvalue.comment.map((value) => {
                                                            return <div style={{ "display": "flex" }}>
                                                                {/* <h3>{value.commented_by}</h3> commented
                                                 <h3>{value.msg}</h3>  */}
                                                                <ListGroup>
                                                                    <ListGroup.Item><FaUserCircle /><b><i><u>{value.commented_by} </u></i></b>commented <b>{value.msg}</b></ListGroup.Item>

                                                                </ListGroup>
                                                            </div>
                                                        })
                                                    }
                                                </div>

                                            </form>)}


                                        <Accordion allowMultipleOpen>
                                            <div></div>

                                            <div label="Add a Comment" isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                                <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                                    <strong>Write your comment</strong><br />
                                                </div><form
                                                    onSubmit={(e) => {
                                                        e.preventDefault()
                                                        this.handlecomment(cvalue._id)
                                                    }
                                                    }
                                                >
                                                    <textarea
                                                        className="form-control"
                                                        style={{ "width": "100%", "height": "100px" }}
                                                        onChange={(e) => this.setState({ comment: e.target.value })}
                                                    />
                                                    <button type='submit' className="btn btn-primary" >Post</button>
                                                </form>

                                            </div>
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        )
    }


}



