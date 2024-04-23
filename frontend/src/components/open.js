import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup'
import CountDown from './countdown';
import Accordion from '../Accordion';
import Loader from './Loader';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { Loader } from 'rsuite';
// import { Loader, Placeholder } from 'rsuite';

export default class Open extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: "",
            isignored: false,
            block: false,
            key: window.localStorage.getItem("key"),
            userData:"",
            loader:false,
        }
        this.handlereject = this.handlereject.bind(this);
        this.handleaccept = this.handleaccept.bind(this);
        this.handleblockuser = this.handleblockuser.bind(this);
        this.handledeletepost = this.handledeletepost.bind(this);
        this.handleignore = this.handleignore.bind(this);
        this.onTimesup = this.onTimesup.bind(this);
        this.handlejoindata = this.handlejoindata.bind(this);
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
                // sname: "kabir FC",
                _id: window.location.href.split("/").pop(),
            }),
        }).then((res) => res.json()).then((data) => {
            console.log(data.data);
            this.setState({ data: data.data });
            this.setState({loader:false});
        });

        
    }
    componentDidUpdate() {
        let key = this.state.key;
// this.setState({loader:true});

        window.localStorage.setItem("key", key)
        // console.log(this.state.sname+"vsc");
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
            this.setState({ sub: data.data });
// this.setState({loader:false});

        });
    }

    onTimesup(e, cvalue) {

        // e.preventDefault();
this.setState({loader:true});

        fetch("http://localhost:8080/blockuserend", {

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
                cvalue,

            }),
        }).then((res) => res.json()).then((data) => {
            console.log("ok");
            window.location.reload(false);
this.setState({loader:true});
            alert(data.status);
            

        });
        // window.location.reload(false)
        //    
        // alert(`Time's up!`)
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
            console.log("ok");
            this.setState({loader:false});

        });
        window.location.reload(false)
    }
    handleblockuser(e, cvalue) {
        e.preventDefault();
        console.log(cvalue.countdown,cvalue._id);
         this.setState({loader:true});

        fetch("http://localhost:8080/blockuser", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                countdown:cvalue.countdown,
                newid:cvalue._id,
                // reportedto:cvalue.reportedto,
                // cvalue,
            }),
        }).then((res) => res.json()).then((data) => {
            window.location.reload(false);
            this.setState({loader:false});
            console.log("ok");
            // alert(data.status);

        });
    }
    async handledeletepost(e, cvalue) {
        e?.preventDefault();
        // console.log(cvalue);
        //  this?.setState({loader:true});

      await fetch("http://localhost:8080/deletepost", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                cvalue
            }),
        })?.then((res) => res?.json())?.then((data) => {
            // console.log("ok");
            // this?.setState({loader:false});
            // alert(data.status);

        });
        window.location?.reload(false)
    }
    handleignore(e, cvalue) {
        e.preventDefault();
        this.setState({ isignored: true })
        console.log(cvalue);
        fetch("http://localhost:8080/ignore", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                cvalue
            }),
        }).then((res) => res.json()).then((data) => {
            console.log("ok");
            alert(data.status);

        });
        window.location.reload(false)
    }
    async handlereject(e, cvalue) {
        e.preventDefault();
        console.log(cvalue);
this.setState({loader:true});
       await fetch("http://localhost:8080/reject", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                _id: window.location.href.split("/").pop(),
                email: cvalue,
            }),
        }).then((res) => res.json()).then((data) => {
            console.log("ok");
            this.setState({loader:false});

        });
        window.location.reload(false)
    }
    async handlejoindata(e,cvalue)
    {
      e.preventDefault();
this.setState({loader:true});

      await fetch("http://localhost:8080/UserProfilebyemail", {
        method: "POST",
        crossDomain: "true",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            cvalue
        }),
    }).then((res) => res.json()).then((data) => {
     console.log(data.data);this.setState({ userData: data.data });
     this.setState({loader:false});

    });
    }
    render() {
        const data = this.state.data;
        // console.log(this.state.key);
        return (
            <>
{/* <div>
    <Placeholder.Paragraph rows={8} />
    <Loader backdrop content="loading..." vertical />
  </div> */}
  {this.state.loader &&<Loader></Loader>}
  {!this.state.loader &&
                <div style={{ display: 'block', "width": "100%", "padding": 30 }} className="auth-inner2">
                    <Tabs defaultActiveKey={this.state.key} >
                        <Tab eventKey="first" title="Users" onPointerOut={() => this.setState({ key: "first" })}>
                            <div style={{ "width": "100%" }} id="line">
                                <label>Follow ers</label><br />
                                {data.follower?.map((cvalue) => {
                                    return <div>
                                        <ListGroup>
                                            <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}>{cvalue}</ListGroup.Item>
                                        </ListGroup>
                                        {/* <label>Blocked</label><br/>
                                    <ListGroup>
                                    <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}>{cvalue}</ListGroup.Item>
                                </ListGroup> */}
                                    </div>
                                })}
                                <hr />
                                <label>Blocked</label><br />
                                {data.blocked?.map((cvalue) => {
                                    return <div>
                                        {/* <label>Followers</label><br/>
                                    <ListGroup>
                                        <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}>{cvalue}</ListGroup.Item>
                                    </ListGroup>
                                    <hr/> */}
                                        <ListGroup>
                                            <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}>{cvalue}</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                })}
                            </div>
                        </Tab>
                        <Tab eventKey="second" title="Join Request" onPointerOut={() => this.setState({ key: "second" })}>

                            {data.pending?.map((cvalue) => {
                                return <div>
                                <div onClick={(e)=>this.handlejoindata(e,cvalue)}>


                                    <Accordion allowMultipleOpen >
                                        <div></div>
                                        <div label={cvalue} isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                            <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                                <strong> First Name:</strong> {this.state.userData.fname}<br />
                                                <strong> Last Name:</strong> {this.state.userData.lname}<br />
                                                <strong> Age:</strong> {this.state.userData.age}<br />
                                            </div>
                                        </div>
                                    </Accordion>
                                    </div>



                                    {/* <ListGroup>
                                        <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}> */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button className="d-flex" style={{ display: 'flex', "alignContent": "end", "justifyContent": "flex-end" }} onClick={(e) => { this.handleaccept(e, cvalue) }}>
                                                Accept
                                            </button>
                                            <button className="d-flex" style={{ display: 'flex', "alignContent": "end", "justifyContent": "flex-end" }} onClick={(e) => { this.handlereject(e, cvalue) }} >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                    {/* </ListGroup.Item>
                                    </ListGroup> */}
                                </div>
                            })}
                        </Tab>
                        <Tab eventKey="third" title="Reported" onPointerMove={() => this.setState({ key: "third" })}>

                            <div style={{ "width": "100%" }}>

                                {data.reported?.map((cvalue) => {
                                    return <div>
                                        <ListGroup>
                                            <ListGroup.Item style={{ "width": "auto", "backgroundColor": "#ed9978", "fontFamily": "sans-serif", "fontStyle": "italic" }}>
                                                <div style={{ display: 'grid' }}>
                                                    <div style={{ display: 'grid', }}>
                                                        <h4>{cvalue.reportedto}</h4>
                                                        <label>Post</label>
                                                        <input type='text' value={cvalue.post} disabled></input> <br></br>
                                                        <label>Concern</label>
                                                        <input type='text' value={cvalue.report} disabled></input> <br></br>
                                                        <i>reported by</i>
                                                        <label >~ {cvalue.reportedby}</label>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <button id={cvalue._id} className="d-flex" style={{ display: 'flex', "alignContent": "end", "justifyContent": "flex-end" }} onClick={(e) => { this.handleblockuser(e, cvalue) }} disabled={!cvalue.fade}>
                                                            Block User {cvalue?.countdown &&
                                                                <CountDown
                                                                    onTimesup={(e) => this.onTimesup(e, cvalue)}
                                                                    duration={5}
                                                                    id={cvalue._id}
                                                                />
                                                            }
                                                        </button>
                                                        <button className="d-flex" style={{ display: 'flex', "alignContent": "end", "justifyContent": "flex-end" }} onClick={(e) => { this.handledeletepost(e, cvalue) }} disabled={!cvalue.fade}>
                                                            Delete Post
                                                        </button>
                                                        <button className="d-flex" style={{ display: 'flex', "alignContent": "end", "justifyContent": "flex-end" }} onClick={(e) => { this.handleignore(e, cvalue) }}  >
                                                            Ignore
                                                        </button>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                })}
                            </div>
                        </Tab>

                        <Tab eventKey="fourth" title="Stats" onPointerMove={() => this.setState({ key: "fourth" })}>

                            <div style={{ "width": "100%" }} id="line" >
                            <div className="booklist"  >
                         
                            <div className ='book' >
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Posts vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={data.stats}
                                            margin={{ "top": 5, "right": 30, "left": 20, "bottom": 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="no_of_post" stroke="black" interval={1} />
                                            <Tooltip />

                                            <Line type="monotone" strokeWidth="2" dataKey="no_of_post" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </div>
                                    <div className ='book'>
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Users vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={data.stats}
                                            margin={{ "top": 5, "right": 30, "left": 20, "bottom": 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="no_of_user" stroke="black" interval={1} />
                                            <Tooltip />
                                            <Line type="monotone" strokeWidth="2" dataKey="no_of_user" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </div>
                             
                                    
                                  
                                    <div className="book">
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Vistors vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={data.stats}
                                            margin={{ "top": 5, "right": 30, "left": 20, "bottom": 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="no_of_visitor" stroke="black" />
                                            <Tooltip />
                                            <Line type="monotone" strokeWidth="2" dataKey="no_of_visitor" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </div>
                                    <div className ='book' >
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Reports vs Deleted Reports</p>
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={data.stats}
                                            margin={{ "top": 5, "right": 30, "left": 20, "bottom": 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="33" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis stroke='black' />
                                            <Tooltip />
                                            <Bar dataKey="no_of_report" fill="#fa709a" barSize={30} />
                                            <Bar dataKey="no_of_delete" fill="red" barSize={30} />
                                        </BarChart>
                                    </div>
                                </div>

                                    </div>
                           
                        </Tab>

                    </Tabs>
                </div>}
            </>
        )
    }


}