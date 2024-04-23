import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from '../Accordion';
import { HiUserGroup } from 'react-icons/hi'
import { AiFillLike, AiFillDislike, AiOutlineComment } from 'react-icons/ai'
import { GoReport } from 'react-icons/go'
import { FaUserCircle } from 'react-icons/fa'
import { BsBookmarkPlusFill,BsBookmarkPlus } from 'react-icons/bs'
import ListGroup from 'react-bootstrap/ListGroup';
import Loader from './Loader';

// import ListGroup from 'react-bootstrap/ListGroup';
// import Tabs from 'react-bootstrap/Tabs';
// import Tab from 'react-bootstrap/Tab';
// import ReactSwipeButton from "react-swipe-button";

function blockedname(data,post,owner)
{
    console.log("owner"+owner,data)
    if(data?.blocked?.includes(post))
    { 
        if(owner)
        {
            return <label><b>{post}</b></label>
        }
        return <label><b>blocked</b></label>
    }
    else
    return <label><b><i><u>{post}</u></i></b></label>
}

export default class Open1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: window.location.href.split("/").pop(),
            data: "",
            show: false,
            show1: false,
            clicked: false,
            content: "",
            clicked1: false,
            post: [],
            comment: "",
            report:"",
            saved:false,
            owner:false,
            loader:false,
        }
        this.handlepost = this.handlepost.bind(this);
        this.handlelike = this.handlelike.bind(this);
        this.handlesave = this.handlesave.bind(this);
        this.handlefollow = this.handlefollow.bind(this);
        this.handledislike = this.handledislike.bind(this);
        this.handlecomment = this.handlecomment.bind(this);
        this.handlereport = this.handlereport.bind(this);
    };

    componentDidMount() {
        this.setState({loader:true});
        fetch("http://localhost:8080/open", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log(data.data);
            this.setState({ data: data.data });
            console.log(data.data);
            this.setState({loader:false});

        });

        this.setState({loader:true});
        fetch("http://localhost:8080/fetchpost", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {

            this.setState({ post: data.data });
            this.setState({ owner: data.status });
            this.setState({loader:false});
            console.log(data.status);

        });
    }

    handlelike(e, postid) {
        e.preventDefault();
        this.setState({loader:true});
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
                _id: window.location.href.split("/").pop(),
                postid,
            }),
        }).then((res) => res.json()).then((data) => {

            // this.setState({ post: data.data });
            this.setState({loader:false});
            window.location.reload(false);
        });
    }
    handledislike(e, postid) {
        e.preventDefault();
        this.setState({loader:true});
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
                _id: window.location.href.split("/").pop(),
                postid,
            }),
        }).then((res) => res.json()).then((data) => {
            this.setState({loader:false});
            //   this.setState({ post: data.data });
            window.location.reload(false);
        });
    }
    componentDidUpdate() {
        // console.log(this.state.sname + "vsc");

        // console.log(str);
        
        fetch("http://localhost:8080/open", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log(data.data); 
            // this.setState({ data: data.data });
        });
    }
    handlecomment(cvalue) {
        // const postid = cvalue;
        // console.log(cvalue);
        this.setState({loader:true});
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
                _id: window.location.href.split("/").pop(),
                comment: this.state.comment,
                postid: cvalue,
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log("ok");
            if (data.status === "ok")
                alert("comment posted")
               
        });
        // console.log(cvalue);
        this.setState({loader:false});
        window.location.reload(false)
    }
    handlefollow(e, cvalue) {
        e.preventDefault();
        const email = cvalue;
        // console.log(email)
        this.setState({loader:true});
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
            alert(data.status);

        });
        this.setState({loader:false});
        // //   console.log(cvalue);
        // window.location.reload(false)
    }
    handleaccept(e, cvalue) {

        e.preventDefault();
        const email = cvalue;
        this.setState({loader:true});
        fetch("http://localhost:8080/accept", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                email
            }),
        }).then((res) => res.json()).then((data) => {
            // console.log("ok");

        });
        //   console.log(cvalue);
        window.location.reload(false);
        this.setState({loader:false});
    }
    handlepost(event, Banned) {
        event.preventDefault();
        
        // console.log(this.state.content,Banned);
        const str = this.state.content;
        let newstr = "";
        let arr = [];
        arr=str.split(" ")
        Banned.map((i) => {
            for(let j=0 ;j<arr.length;j++)
            {
                // console.log(arr[j]?.toLowerCase()===i?.toLowerCase());
                if(arr[j]?.toLowerCase()===i?.toLowerCase())
                {
                    arr[j]="*";
                }
            }
            // return arr = str.split(i);
            return arr;
        })
        if (arr?.includes("*")) {
            alert("used banned keyword will be replaced by *")
        }

        for (let i of arr) {
            newstr = newstr.concat(" ", i)
        }
        newstr = newstr.slice(1);
        // console.log(arr, newstr);
        this.setState({ content: newstr })
        this.setState({loader:true});
        fetch("http://localhost:8080/posted", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                token: window.localStorage.getItem("token"),
                content: newstr,
            }),
        }).then((res) => res.json()).then((data) => {
            window.location.reload(false);
            this.setState({loader:false});
            if (data.status === "ok") {
                alert(" msg posted")
            }
        });
    }
    handlesave(e, postid) {
        e.preventDefault();
        console.log(postid);
        this.setState({loader:true});
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
                _id: window.location.href.split("/").pop(),
                postid,
            }),
        }).then((res) => res.json()).then((data) => {

            if(data.status==="ok")
            {
                    this.setState({ saved:!this.state.saved });
                    alert("Post saved")
            }
            else
            {
                alert(data.status)
            }
            this.setState({loader:false});
            window.location.reload(false);

        });
    }
    handlereport(postid)
    {
        // e.preventDefault();
        console.log(postid);
        this.setState({loader:true});
        fetch("http://localhost:8080/report", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                _id: window.location.href.split("/").pop(),
                postid,
                report:this.state.report,
            }),
        }).then((res) => res.json()).then((data) => {

            if(data.status==="ok")
            {
                    this.setState({ saved:!this.state.saved });
                    alert("User Reported");
            }
            else
            {
                alert(data.status)
            }
            this.setState({loader:false});
            window.location.reload(false);
        });
    }
    render() {

        const data = this.state.data;
        const { post } = this.state;
        const handleShow = () => this.setState({ show: true });
        const handleClose = () => this.setState({ show: false });
        const handlebanned = (e, arr) => {
            e.preventDefault();
            this.setState({ content: e.target.value })
        }
        console.log(this.state.owner);
        return (
            <>
       {this.state.loader &&<Loader></Loader>}

      {!this.state.loader &&
     <div style={{"paddingLeft":"100px","paddingRight":"100px"}}>
                <div className="line" style={{ "marginTop": "240px", "marginLeft": "auto" }}>
                    <h1> ... Create a New Post ... </h1>
                    <button onClick={() => this.setState({ clicked: true })} type='new' className="btn btn-primary" style={{ "marginTop": "0px", "marginLeft": "95px" }}> + Create a New Post</button>
                    <div className='line' >
                        {this.state.clicked && (

                            <form onSubmit={(e) => this.handlepost(e, data.Banned_keywords)} >

                                <button onClick={() => this.setState({ clicked: false })} type='new' className="btn btn-primary" style={{ "marginTop": "0px", "marginLeft": "340px" }}>X</button>
                                <div>
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        style={{ "width": "100%", "height": "100px" }}
                                        onChange={(e) => handlebanned(e, data.Banned_keywords)}
                                        required
                                    />
                                </div>
                                <button type='submit' className="btn btn-primary">Submit</button>
                            </form>)}
                        <div style={{ "display": "flex", "position": "sticky", "textAlign": "center" }}>
                            <Button onClick={handleShow} style={{ "marginLeft": "85px" }}>
                                <HiUserGroup /> User Details
                            </Button>
                            <Offcanvas show={this.state.show} onHide={handleClose} placement="start" style={{ "backgroundColor": "#e15b26", "position": "fixed", }}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title><HiUserGroup /> Details</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <label style={{ "textAlign": "center" }}><h1>Greddiit Name</h1></label><br />
                                    <label><h2>{data.sname}</h2></label><br />
                                    <img src={data.image} alt='' style={{ "width": "100px", "height": "100px", "borderRadius": "10px", "textAlign": "center", "marginLeft": "100px" }} /><br></br>
                                    <label><h2>no. of followers</h2></label><br />
                                    <label>{data.follower?.length}</label><br />
                                    <label><h2>Description</h2></label><br />
                                    <label>{data.desc}</label><br />
                                    <label><h2>Banned keywords</h2></label><br></br>
                                    <label>{data.Banned_keywords?.map((tvalue) => {
                                        return <div>
                                            <ListGroup>
                                                <ListGroup.Item key={tvalue} style={{ "width": "100%" }}>{tvalue}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    })}

                                    </label>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </div>
                    </div>
                </div>

                {
                    post?.map((cvalue) => {
                        // console.log(cvalue.comment);
                        return <div>
                            <div className="card" style={{ "width": "100%", " marginLeft": "140px", "marginTop": "20px", "backgroundColor": "" }}>
                                <div className="card-body" style={{}}>
                                    <h5 style={{ textAlign: "left" }} className="card-title">{cvalue.sname}</h5>
                                    <ul className="list-group" style={{ textAlign: "left" }}>
                                    <button className="btn btn-primary" style={{ "textAlign":"center","marginLeft": "10px","height":"30px" }} onClick={(e)=>this.handlesave(e,cvalue._id)}><BsBookmarkPlus/>Save Post</button>
                                        <li className="list-group-item"> 
                                        {cvalue.post}
                                        <label style={{"display": "flex", "justifyContent": "right","alignItems":"center"}}> 
                                        <i> ~ </i> <b><i><u><FaUserCircle />{blockedname(data,cvalue.postedby,this.state.owner)}</u></i></b>
                                        <button className="btn btn-primary" style={{ "textAlign":"center","marginLeft": "10px","height":"30px" }} onClick={(e)=>this.handlefollow(e,cvalue.postedby)}>Follow</button>
                                        </label>
                                        </li>
                                    </ul>
                                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={(e) => { this.handlelike(e, cvalue._id) }}><AiFillLike />{cvalue.liked?.length}</button >
                                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={(e) => { this.handledislike(e, cvalue._id) }}><AiFillDislike />{cvalue.disliked?.length}</button>
                                    <button className="btn btn-secondary" style={{ margin: "10px" }}><GoReport />Report</button>
                                    <button id={cvalue._id} onClick={() => this.setState({ clicked1: !this.state.clicked1 })} className="btn btn-secondary" style={{ margin: "10px" }}><AiOutlineComment />" "Comments</button>
                                    {/* <label>{cvalue.comment.map((item)=>{
                           return <h1>{item.msg}</h1>
                          })}</label> */}
                                    {this.state.clicked1 && document.getElementById(cvalue._id) &&(
                                      <div>
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

                                        </form>
                                        </div>
                                        )}

                                        
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

                                    <Accordion allowMultipleOpen>
                                        <div></div>

                                        <div label="Report this post" isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                            <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                                <strong> Report post</strong><br />
                                            </div><form
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    this.handlereport(cvalue._id)
                                                }
                                                }
                                            >
                                                <textarea
                                                    className="form-control"
                                                    style={{ "width": "100%", "height": "100px" }}
                                                    onChange={(e) => this.setState({ report: e.target.value })}
                                                />
                                                <button type='submit' className="btn btn-primary" >Report</button>
                                            </form>

                                        </div>
                                    </Accordion>
                                </div>
                            </div>
                        </div>

                    })}
                </div>}
            </>
        )
    }


}
