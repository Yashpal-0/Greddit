import React, { Component } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiUserGroup } from 'react-icons/hi'
import ListGroup from 'react-bootstrap/ListGroup';
import ChipInput from 'material-ui-chip-input';
import { FaWindowClose } from 'react-icons/fa'
import { Button } from 'react-bootstrap';
import Accordion from '../Accordion';
import avtar from "./images.png"
import { FiMaximize2 } from 'react-icons/fi'
import Loader from './Loader'

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

export default class Mysub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sub: [],
            sname: "",
            desc: "",
            clicked: false,
            sessionData: {
                tags: [],
                Banned_keywords: [],
            },
            show: false,
            show1: false,
            image: "",
            loader:false,
        };
        this.addChip = this.addChip.bind(this);
        this.removeChip = this.removeChip.bind(this);
        this.handleaddnewsub = this.handleaddnewsub.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.setState({ loader: true });
        fetch("http://localhost:8080/mysub", {
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
            // console.log(data.data, "userprofile"); 
            this.setState({ sub: data.data });
            this.setState({ loader: false });
        });
    }

    componentDidUpdate() {
        fetch("http://localhost:8080/mysub", {
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

            this.setState({ sub: data.data });
        });
    }


    addChip = (value, name) => {
        const { sessionData } = this.state;
        sessionData[name].push(value.charAt(0).toUpperCase() + value.slice(1));
        this.setState({ sessionData });
    };
    removeChip = (chip, index, name) => {
        const { sessionData } = this.state;
        sessionData[name].splice(index, 1);
        this.setState({ sessionData });
    };

    handleDelete(event) {
        // console.log(event);
        this.setState({ loader: true });
        fetch("http://localhost:8080/deletesub", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                id: event,
            }),
        }).then((res) => res.json()).then((data) => {
            if (data.status === "ok") {
                alert("Sub Deleted");
            }
            this.setState({ loader: false });
        });

    }

    handleaddnewsub(event) {
        event.preventDefault();
        const { sname, desc ,image} = this.state;
        const { tags, Banned_keywords } = this.state.sessionData;
        const token = window.localStorage.getItem("token");
        this.setState({ loader: true });
        fetch("http://localhost:8080/newsub", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                sname,
                desc,
                tags,
                Banned_keywords,
                token,
                image,
                
            }),
        }).then((res) => res.json()).then((data) => {
            console.log("ok");
            if (data.status === "ok") {
                alert("New Sub-Greddiit Addedd Successfully meri jaan");
                window.location.reload(false);
            }
            else {
                alert(data.status);
            }
            this.setState({ loader: false });
        });
    }

    render() {
        const { sub } = this.state;
        const handleShow = () => this.setState({ show: true });
        const handleClose = () => this.setState({ show: false });
        const handleFileUpload = async (e) => {
            const file = e.target.files[0];
            if(file.size < 75000)
            {
                const base64= await convertToBase64(file);
                this.setState({image:base64});
            }
            else{
                alert("photo to large");
            }
             console.log(file.size);
        }



        return (
            <>
            {this.state.loader &&<Loader></Loader>}
  {!this.state.loader && <div className='auth-inner1'>
                <div className="line" style={{ "marginTop": "240px", "marginLeft": "auto" }}>
                    <h1>New Sub-Greddiit :-) </h1>
                    <button onClick={() => this.setState({ clicked: true })} type='new' className="btn btn-primary" style={{ "marginTop": "0px", "marginLeft": "0px" }}> + Create New Sub_greddiit</button>
                    <div className='line' >
                        {this.state.clicked && (
                            <form onSubmit={this.handleaddnewsub}>
                                <label htmlFor='file-upload' className='custom-file-upload'>
                                    <img alt='' src={this.state.image||avtar} style={{ "height": "100px", "borderRadius": "15px", "justifyContent": "centre", "alignItems": "center","display":"flex","maxWidth":"350px" }} />
                                </label>
                                <button onClick={() => this.setState({ clicked: false })} type='new' className="btn btn-primary" style={{ "marginTop": "0px", "marginLeft": "340px" }}> <FaWindowClose /></button>
                                <div>
                                    <input
                                        type="file"
                                        className='form-control'
                                        label="image"
                                        name="myFile"
                                        id="file-upload"
                                        accept='.jpeg , .png , .jpg'
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                </div>
                                <div>
                                    <label>Sub-Greddiit Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => this.setState({ sname: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        style={{ "width": "100%", "height": "100px" }}
                                        onChange={(e) => this.setState({ desc: e.target.value })}
                                    />
                                </div>

                                <label htmlFor="uname1">tags Used</label>
                                <ChipInput
                                    style={{ " width": "100%", "height": "auto", "marginTop": "10px", "marginBottom": "10px", "display": "block" }}
                                    value={this.state.sessionData.tags}
                                    onAdd={value => this.addChip(value, "tags")}
                                    onDelete={(chip, index) => this.removeChip(chip, index, "tags")}
                                    variant="outlined"
                                    onChange={(e) => this.setState({ tags: e.target.value })}
                                    newChipKeyCodes={[9, 13, 187, 188]}
                                />

                                <label htmlFor="uname1">Banned keywords</label>
                                <ChipInput
                                    style={{ "width": "100%", "height": "auto", "marginTop": "10px", "display": "block" }}
                                    value={this.state.sessionData.Banned_keywords}
                                    onAdd={value => this.addChip(value, "Banned_keywords")}
                                    onDelete={(chip, index) => this.removeChip(chip, index, "Banned_keywords")}
                                    variant="outlined"
                                    onChange={(e) => this.setState({ Banned_keywords: e.target.value })}
                                    newChipKeyCodes={[9, 13, 187, 188]}
                                />
                                <button type='submit' className="btn btn-primary">Submit</button>
                            </form>)}
                    </div>
                </div>

                <div>

                    <div className="" style={{ "marginTop": "1vh", "marginLeft": "0px", "height": "800px" }}>
                        <Button variant="primary" onClick={handleShow} className="me-2">
                            <HiUserGroup /> My-Sub-Greddiits
                        </Button>
                        <Offcanvas show={this.state.show} onHide={handleClose} placement="start" style={{ "backgroundColor": "#e15b26" }}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title><HiUserGroup /> My Sub-Greddiit</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>

                                {
                                    sub.map((cvalue) => {
                                        return <Accordion allowMultipleOpen>
                                            <div></div>
                                            <div label={cvalue.sname} isOpen>
                                                <strong>Sub-greddiit Name:</strong> {cvalue.sname}<br />
                                               <button style={{"display":"flex","flexDirection":"column" ,"marginLeft":"280px"}} onClick={()=>{window.location.href=`/open/${cvalue._id}`}}><FiMaximize2/></button>
                                               <label style={{
                                                    "height": "100px", "borderRadius": "15px",
                                                    "display":"flex","justifyContent":"center",
                                                    "justifySelf":"center","justifyItems":"center",
                                                    "alignItems":"center","alignContent":"center"
                                                }}> <img alt='' src={cvalue.image} style={{
                                                    "height": "100px","width":"100px", "borderRadius": "15px",
                                                    "display":"flex","justifyContent":"center",
                                                    "justifySelf":"center","justifyItems":"center",
                                                    "alignItems":"center","alignContent":"center",
                                                    "maxWidth": "300px"
                                                }}/></label>

                                                <strong>Sub-greddiit description:</strong>
                                                <textarea
                                                    readOnly
                                                    className="form-control"
                                                    style={{
                                                        "background": "#ffff",
                                                        "border": '1px  #fceee9',
                                                        "borderRadius": '5px',
                                                        "marginTop": "10",
                                                        "padding": '10px 20px',
                                                        "width":"auto",
                                                        "height":"auto",
                                                    }}
                                                    value={cvalue.desc}
                                                />
                                                <br />
                                                <strong>User post:</strong> 1
                                                <br />
                                                <strong>Tags:</strong> {cvalue.tags.map((tvalue, id) => {
                                                    return <div>
                                                        <ListGroup>
                                                            <ListGroup.Item key={id} style={{ "width": "auto" }}>{tvalue}</ListGroup.Item>
                                                        </ListGroup>
                                                    </div>
                                                })}
                                                <br />

                                                <button onClick={() => this.handleDelete(cvalue._id)}>Delete sub</button>
                                            </div>
                                        </Accordion>
                                    })
                                }

                            </Offcanvas.Body>
                        </Offcanvas>

                    </div>
                </div>
            </div>}
            </>
        )
    }
}