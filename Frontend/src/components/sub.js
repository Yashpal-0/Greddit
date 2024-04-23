import React, { Component } from 'react'
import Accordion from '../Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import ChipInput from 'material-ui-chip-input';
import { FiMaximize2 } from 'react-icons/fi'
import { FaCrown } from 'react-icons/fa'
import { CgLogOut } from 'react-icons/cg'
import { MdOutlinePendingActions } from 'react-icons/md'
import { TbGridDots } from 'react-icons/tb'
import Loader from './Loader';
// const Fuse = require('fuse.js')
import Fuse from 'fuse.js';
export default class Sub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            id: "",
            searched: "",
            sub: [],
            sub1: [],
            datecreated: false,
            name: false,
            followers: false,
            value: true,
            sessionData: {
                tags: []
            },
            loader: false,
        };
        this.handlesearch = this.handlesearch.bind(this);
        this.handlemaximize = this.handlemaximize.bind(this);
        this.handlefilterdate = this.handlefilterdate.bind(this);
        this.handlefilterfollowers = this.handlefilterfollowers.bind(this);
        this.handlefollow = this.handlefollow.bind(this);
        this.handlecheck = this.handlecheck.bind(this);
        this.handlefiltername = this.handlefiltername.bind(this);
        this.handlefilternamereverse = this.handlefilternamereverse.bind(this);
    }

    componentDidMount() {
        this.setState({ loader: true });
        fetch("http://localhost:8080/allsub", {
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
            // console.log(data.status, "userprofile"); 
            this.setState({ email: data.status });
            this.setState({ sub: data.data });
            this.setState({ sub1: data.data.slice() });
            this.setState({ loader: false });
        });
    }

    handlecheck(sname) {
        this.setState({ loader: true });
        fetch("http://localhost:8080/followcheck", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                sname
            }),
        }).then((res) => res.json()).then((data) => {
            this.setState({ value: data.data });
            this.setState({ loader: false });

        });


    }
    handleleave(sname) {
        this.setState({ loader: true });
        fetch("http://localhost:8080/leave", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                sname
            }),
        }).then((res) => res.json()).then((data) => {
            this.setState({ loader: false });
            alert(data.status);
        });
    }
    handlefollow(sname) {
        this.setState({ loader: true });
        fetch("http://localhost:8080/followsub", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                sname
            }),
        }).then((res) => res.json()).then((data) => {

            if (data.status === "ok") {
                alert("user request sent");
            }
            else {
                alert(data.status);
            }
            this.setState({ loader: false });
        });


    }
    handlesearch(event) {
        event.preventDefault();
        // console.log(this.state.sessionData.tags);
        window.location.reload(false);
    }
    handlefilterdate(event) {
        event.preventDefault();
        const { sub1 } = this.state;
        console.log(sub1, this.state.sub1);
        const newsub = [...sub1.reverse()];
        this.setState({ sub: newsub });

    }
    handlefiltername(event) {
        event.preventDefault();
        const { sub } = this.state
        console.log(sub);
        const newsub = sub.sort((b, a) => { return (b.sname?.localeCompare(a.sname)) });
        this.setState({ sub: newsub });

    }
    handlefilternamereverse(event) {
        event.preventDefault();
        const { sub } = this.state
        const newsub = sub.sort((a, b) => { return (b.sname?.localeCompare(a.sname)) });
        this.setState({ sub: newsub });
        console.log(sub);

    }
    handlefilterfollowers(event) {
        event.preventDefault();
        const { sub } = this.state
        const newsub = sub.sort((a, b) => { return (b.follower.length - a.follower.length) });
        this.setState({ sub: newsub });
        console.log(sub);
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
    async handlemaximize(e, _id) {
        this.setState({ loader: true });
        await fetch("http://localhost:8080/maximize", {
            method: "POST",
            crossDomain: "true",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON?.stringify({
                _id
            }),
        })?.then((res) => res?.json())?.then((data) => {

            if (data.status === "ok") {
                window.location.href = `/open1/${_id}`;
            }
            else {
                alert("Something went wrong meri jaan");
            }
            this.setState({ loader: false });
        });
    }
    render() {
        const { sub } = this.state;
        const tag = this.state.sessionData.tags;
        const options = {
            keys: ["sname"],
            // matchAllOnEmptyQuery: true,
        };
        return (
            <>
            {this.state.loader &&<Loader></Loader>}
  {!this.state.loader && <div>
            <div style={{"marginTop":"100px" , "paddingLeft":"100px","paddingRight":"100px"}}>

                <label>Search a SubGreddit</label>
                <div style={{

                    // "MarginBlockEnd":"1000px",
                    "marginBottom": "50px",
                    // "marginRight": "1px",
                    "display": "flex",
                    "flex": "wrap",
                    // "align": "left",
                }}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => this.setState({ searched: e.target.value })} style={{
                        "width": "400px",
                        "height": "35px"
                    }} />
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Filter
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.handlefilterdate}>Date Created</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlefiltername}>Name (A-Z)</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlefilternamereverse}>Name (Z-A)</Dropdown.Item>
                            <Dropdown.Item onClick={this.handlefilterfollowers}>Followers</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button className='btn btn-dark' style={{ "padding": "0px", "marginLeft": "50px", "marginTop": "10px" }} onClick={this.handlesearch}>Tag search</button>
                    <ChipInput
                        style={{ "height": "45px", "marginTop": "10px", "marginLeft": "1px", "display": "flex" }}
                        value={this.state.sessionData.tags}
                        onAdd={value => this.addChip(value, "tags")}
                        onDelete={(chip, index) => this.removeChip(chip, index, "tags")}
                        variant="outlined"
                        onChange={(e) => this.setState({ tags: e.target.value })}
                        newChipKeyCodes={[9, 13, 187, 188]}
                    />
                    <br />
                </div>
                <div>
                    <hr></hr>
                    <label>Owner <FaCrown></FaCrown></label>
                    {

                        sub.filter((cvalue) => {

                            if (tag.length === 0) {
                                if (this.state.searched === "") {
                                    if (cvalue.follower.includes(this.state.email))  //joined
                                    {
                                        if (cvalue.owner === this.state.email)            //owner
                                            return true
                                        return false                                 // follower
                                    }
                                    else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                        return false

                                    else   //not joined
                                        return false
                                }
                                if (this.state.searched) {
                                    // if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    // {
                                    if (cvalue.follower.includes(this.state.email)) {
                                        if (cvalue.owner === this.state.email) {
                                            const fuse = new Fuse(sub, options);
                                            const result = fuse?.search(this.state?.searched);
                                            for (let i = 0; i < result?.length; i++) {
                                                return true;
                                            }
                                        }
                                        //  return true
                                        return false
                                    }
                                    else if (cvalue.pending.includes(this.state.email))
                                        return false

                                    else   //not joined
                                        return false
                                    // }
                                }

                                else
                                    return true
                            }
                            for (let i of tag) {
                                if (cvalue.tags.includes(i)) {
                                    if (this.state.searched === "") {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return true
                                            return false
                                        }
                                        else if (cvalue.pending.includes(this.state.email))
                                            return false

                                        else   //not joined
                                            return false
                                    }
                                    else {

                                        // if (cvalue.sname.toLowerCase()?.includes(this.state.searched?.toLowerCase()))
                                        // {
                                        if (cvalue.follower.includes(this.state.email))  //joined
                                        {
                                            if (cvalue.owner === this.state.email) {
                                                const fuse = new Fuse(sub, options);
                                                const result = fuse?.search(this.state?.searched);
                                                for (let i = 0; i < result?.length; i++) {
                                                    return true;
                                                }
                                            }          //owner
                                            // return true
                                            return false                                 // follower
                                        }
                                        else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                            return false

                                        else   //not joined
                                            return false
                                        // }
                                    }

                                    // else
                                    //     return null
                                }
                            }
                            return false

                        }).map((cvalue) => {
                            return <Accordion allowMultipleOpen>
                                <div></div>
                                <div label={cvalue.sname} isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                    <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                        <div><strong>Sub-greddiit Name:</strong> {cvalue.sname}<br /></div>
                                        <button style={{ "display": "flex", "flexDirection": "row", "marginLeft": "280px" }} onClick={(e) => { this.handlemaximize(e, cvalue._id) }}><FiMaximize2 /></button>
                                    </div><form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.handlefollow(cvalue.sname)
                                    }
                                    }>
                                        <button type='submit' className="btn btn-primary" disabled >Owner</button>
                                    </form>
                                    <label style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }}> <img alt='' src={cvalue.image} style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }} /></label>
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
                                        }}
                                        value={cvalue.desc}
                                    />
                                    <br />
                                    <strong>User post:</strong> 1
                                    <br />
                                    <strong>Tags:</strong> {cvalue.tags.map((tvalue) => {
                                        return <div>
                                            <ListGroup>
                                                <ListGroup.Item key={cvalue} style={{ "width": "auto" }}>{tvalue}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    })}
                                    <br />
                                </div>
                            </Accordion>
                        })
                    }




                    {
                        /////////////////////////////////////////// joined
                    }
                    <hr></hr>
                    <label>Joined <CgLogOut></CgLogOut></label>


                    {

                        sub.filter((cvalue) => {
                            if (tag.length === 0) {
                                if (this.state.searched === "") {
                                    if (cvalue.follower.includes(this.state.email))  //joined
                                    {
                                        if (cvalue.owner === this.state.email)            //owner
                                            return false                                 // follower
                                        return true
                                    }
                                    else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                        return false

                                    else   //not joined
                                        return false
                                }
                                if (this.state.searched) {
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    //   {
                                    if (cvalue.follower.includes(this.state.email)) {
                                        if (cvalue.owner === this.state.email) { return false }
                                        //   return true
                                        else {
                                            const fuse = new Fuse(sub, options);
                                            const result = fuse?.search(this.state?.searched);
                                            for (let i = 0; i < result?.length; i++) {
                                                return true;
                                            }
                                        }
                                    }
                                    else if (cvalue.pending.includes(this.state.email))
                                        return false

                                    else   //not joined
                                        return false
                                    //   }
                                }
                                else
                                    return null
                            }
                            for (let i of tag) {
                                if (cvalue.tags.includes(i)) {
                                    if (this.state.searched === "") {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return false
                                            return true
                                        }
                                        else if (cvalue.pending.includes(this.state.email))
                                            return false

                                        else   //not joined
                                            return false
                                    }
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    else {
                                        if (cvalue.follower.includes(this.state.email))  //joined
                                        {
                                            if (cvalue.owner === this.state.email)            //owner
                                                return false                                 // follower
                                            // return true
                                            else {
                                                const fuse = new Fuse(sub, options);
                                                const result = fuse?.search(this.state?.searched);
                                                for (let i = 0; i < result?.length; i++) {
                                                    return true;
                                                }
                                            }
                                        }
                                        else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                            return false

                                        else   //not joined
                                            return false
                                    }

                                    //   else
                                    //       return null
                                }
                            }
                            return false

                        }).map((cvalue) => {
                            return <Accordion allowMultipleOpen>
                                <div></div>
                                <div label={cvalue.sname} isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                    <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                        <div><strong>Sub-greddiit Name:</strong> {cvalue.sname}<br /></div>
                                        <button style={{ "display": "flex", "flexDirection": "row", "marginLeft": "280px" }} onClick={(e) => { this.handlemaximize(e, cvalue._id) }}><FiMaximize2 /></button>
                                    </div><form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.handleleave(cvalue.sname)
                                    }
                                    }>
                                        <button type='submit' className="btn btn-primary" >Leave</button>
                                    </form>
                                    <label style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }}> <img alt='' src={cvalue.image} style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }} /></label>
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
                                        }}
                                        value={cvalue.desc}
                                    />
                                    <br />
                                    <strong>User post:</strong> 1
                                    <br />
                                    <strong>Tags:</strong> {cvalue.tags.map((tvalue) => {
                                        return <div>
                                            <ListGroup>
                                                <ListGroup.Item key={cvalue} style={{ "width": "auto" }}>{tvalue}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    })}
                                    <br />
                                </div>
                            </Accordion>
                        })
                    }


                    {
                        /////////////////////////////////////// Pending
                    }
                    <hr></hr>
                    <label>Pending <MdOutlinePendingActions></MdOutlinePendingActions></label>

                    {
                        sub.filter((cvalue) => {
                            if (tag.length === 0) {
                                if (this.state.searched === "") {
                                    if (cvalue.follower.includes(this.state.email))  //joined
                                    {
                                        if (cvalue.owner === this.state.email)            //owner
                                            return false                                 // follower
                                        return false
                                    }
                                    else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                        return true

                                    else   //not joined
                                        return false
                                }
                                if (this.state.searched) {
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    //   {
                                    if (cvalue.follower.includes(this.state.email)) {
                                        if (cvalue.owner === this.state.email)
                                            return false
                                        return false
                                    }
                                    else if (cvalue.pending.includes(this.state.email)) {
                                        const fuse = new Fuse(sub, options);
                                        const result = fuse?.search(this.state?.searched);
                                        for (let i = 0; i < result?.length; i++) {
                                            return true;
                                        }
                                    }
                                    //   return true

                                    else   //not joined
                                        return false
                                    //   }
                                }
                                else
                                    return true
                            }
                            for (let i of tag) {
                                if (cvalue.tags.includes(i)) {
                                    if (this.state.searched === "") {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return false
                                            return false
                                        }
                                        else if (cvalue.pending.includes(this.state.email))
                                            return true

                                        else   //not joined
                                            return false
                                    }
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    else {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return false
                                            return false
                                        }
                                        else if (cvalue.pending.includes(this.state.email)) {
                                            const fuse = new Fuse(sub, options);
                                            const result = fuse?.search(this.state?.searched);
                                            for (let i = 0; i < result?.length; i++) {
                                                return true;
                                            }
                                        }
                                        // return true

                                        else   //not joined
                                            return false
                                    }

                                    //   else
                                    //       return null
                                }
                            }
                            return false

                        }).map((cvalue) => {
                            return <Accordion allowMultipleOpen>
                                <div></div>
                                <div label={cvalue.sname} isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                    <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                        <div><strong>Sub-greddiit Name:</strong> {cvalue.sname}<br /></div>
                                        {/* <button style={{ "display": "flex", "flexDirection": "row", "marginLeft": "280px" }} onClick={(e) => { this.handlemaximize(e, cvalue._id) }}><FiMaximize2 /></button> */}
                                    </div><form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.handlefollow(cvalue.sname)
                                    }
                                    }>
                                        <button type='submit' className="btn btn-primary" disabled>Requested</button>
                                    </form>
                                    <label style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }}> <img alt='' src={cvalue.image} style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }} /></label>
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
                                        }}
                                        value={cvalue.desc}
                                    />
                                    <br />
                                    <strong>User post:</strong> 1
                                    <br />
                                    <strong>Tags:</strong> {cvalue.tags.map((tvalue) => {
                                        return <div>
                                            <ListGroup>
                                                <ListGroup.Item key={cvalue} style={{ "width": "auto" }}>{tvalue}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    })}
                                    <br />
                                </div>
                            </Accordion>
                        })
                    }










                    {
                        /////////////////////////////////////// not Joined
                    }
                    <hr></hr>
                    <label>Others <TbGridDots></TbGridDots></label>

                    {

                        sub.filter((cvalue) => {
                            // console.log("hbcsjsdhcdhsjdsc");
                            // this.handlecheck(cvalue.sname)

                            if (tag.length === 0) {
                                // console.log("csvsjdvbdvcj")
                                if (this.state.searched === "") {
                                    if (cvalue.follower.includes(this.state.email))  //joined
                                    {
                                        if (cvalue.owner === this.state.email)            //owner
                                            return false                                 // follower
                                        return false
                                    }
                                    else if (cvalue.pending.includes(this.state.email))  //pendng reqs
                                        return false

                                    else   //not joined
                                        return true
                                }
                                if (this.state.searched) {
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    //   {
                                    if (cvalue.follower.includes(this.state.email)) {
                                        if (cvalue.owner === this.state.email)
                                            return false
                                        return false
                                    }
                                    else if (cvalue.pending.includes(this.state.email))
                                        return false

                                    else {
                                        const fuse = new Fuse(sub, options);
                                        const result = fuse?.search(this.state?.searched);
                                        for (let i = 0; i < result?.length; i++) {
                                            return true;
                                        }
                                    } //not joined
                                    const fuse = new Fuse(sub, options);
                                    const result = fuse?.search(this.state?.searched);
                                    for (let i = 0; i < result?.length; i++) {
                                        return true;
                                    }
                                    //   }
                                }

                                // console.log("follower "+ cvalue.sname);

                            }
                            for (let i of tag) {
                                if (cvalue.tags.includes(i)) {
                                    // console.log("csvsjdcj")
                                    if (this.state.searched === "") {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return false
                                            return false
                                        }
                                        else if (cvalue.pending.includes(this.state.email))
                                            return false

                                        else   //not joined
                                            return true
                                    }
                                    //   if (cvalue.sname?.toLowerCase().includes(this.state.searched?.toLowerCase()))
                                    else {
                                        if (cvalue.follower.includes(this.state.email)) {
                                            if (cvalue.owner === this.state.email)
                                                return false
                                            return false
                                        }
                                        else if (cvalue.pending.includes(this.state.email))
                                            return false

                                        else   //not joined
                                        {
                                            const fuse = new Fuse(sub, options);
                                            const result = fuse?.search(this.state?.searched);
                                            for (let i = 0; i < result?.length; i++) {
                                                return true;
                                            }
                                        }
                                        const fuse = new Fuse(sub, options);
                                        const result = fuse?.search(this.state?.searched);
                                        for (let i = 0; i < result?.length; i++) {
                                            return true;
                                        }
                                    }

                                    //   else
                                    //       return null
                                }
                            }
                            return false

                        }).map((cvalue) => {
                            // this.handlecheck(cvalue.sname)
                            return <Accordion allowMultipleOpen>
                                <div></div>
                                <div label={cvalue.sname} isOpen style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }} >
                                    <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" }}>
                                        <div style={{"textAlign":"center","float":"center","justifyContent":"center"}}><strong>Sub-greddiit Name:</strong> {cvalue.sname}<br /></div>
                                        {/* <button style={{ "display": "flex", "flexDirection": "row", "marginLeft": "280px" }} onClick={(e) => { this.handlemaximize(e, cvalue._id) }}><FiMaximize2 /></button> */}
                                    </div><form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.handlefollow(cvalue.sname)
                                    }
                                    }>
                                        <button type='submit' className="btn btn-primary">Join</button>
                                    </form>
                                    <label style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }}> <img alt='' src={cvalue.image} style={{
                                        "height": "100px", "borderRadius": "15px",
                                        "display": "flex", "justifyContent": "center",
                                        "justifySelf": "center", "justifyItems": "center",
                                        "alignItems": "center", "alignContent": "center"
                                    }} /></label>
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
                                        }}
                                        value={cvalue.desc}
                                    />
                                    <br />
                                    <strong>User post:</strong> 1
                                    <br />
                                    <strong>Tags:</strong> {cvalue.tags.map((tvalue) => {
                                        return <div>
                                            <ListGroup>
                                                <ListGroup.Item key={cvalue} style={{ "width": "auto" }}>{tvalue}</ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    })}
                                    <br />
                                </div>
                            </Accordion>
                        })
                    }
                </div>
            </div>
            </div>}
            </>
        )
    }
}
