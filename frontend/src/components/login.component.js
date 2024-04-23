import React, { Component } from 'react'
import { GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialGoogle } from "reactjs-social-login";
// var loggedin=window.localStorage.getItem("in");
// var loggedup=window.localStorage.getItem("up");
import Loader from './Loader';
export default class Login extends Component {
  // state={
  //   loggedin:JSON.stringify(window.localStorage.getItem("in")),
  //   loggedup:window.localStorage.getItem("up")
  // }

  constructor(props) {

    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      contact: "",
      age: "",
      user_name:"",
      loader:false,
      s_email: "",
      s_password: "",

      gfname: "",
      glname: "",
      gemail: "",
      gpassword: "",
      // gcontact: "",
      gage: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlecas = this.handlecas.bind(this);
    this.handleSubmitsignup = this.handleSubmitsignup.bind(this);
  }

  componentDidUpdate() {
    // this.setState({loader:true});
    if (window.localStorage.getItem("G_auth")) {
      this.setState({loader:true});

      const { gfname, glname, gemail, gpassword, gage } = this.state;
      // console.log(fname,lname,email,password);

      fetch("http://localhost:8080/google", {
        method: "POST",
        crossDomain: "true",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          fname: gfname,
          lname: glname,
          email: gemail,
          password: gpassword,
          age: gage,
        }),
      }).then((res) => res.json()).then((data) => {
        console.log(data, "user Registered")
        if(data.status==="ok"){
          this.setState({loader:false});
          window.localStorage.setItem("token",data.data);
          window.localStorage.setItem("loggedIn",true);

          window.location.href=`http://localhost:8080/auth/${gemail}`;
        }
        else if(data.status==="done"){
          this.setState({loader:false});
          window.localStorage.setItem("token",data.data);
          window.localStorage.setItem("loggedIn",true);

          window.location.href="/userprofile";
        }
        else{
          alert(data.error);
        }

      });
    }
   
  }

  handleSubmit(e) {
    console.log(this.state);
    e.preventDefault();
    const { s_email, s_password } = this.state;
    // console.log(email,password);
    this.setState({loader:true});
    fetch("http://localhost:8080/login", {
      method: "POST",
      crossDomain: "true",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: s_email,
        password: s_password,
      }),
    }).then((res) => res.json()).then((data) => {
      console.log(data, "user logged in")
      if (data.status === "ok") {
        // this.setState({loader:false});
        alert("login successful meri jaan");
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);
        window.location.href = "/userprofile";
      }
      else {
        alert(data.error);
      }
    });
  }

  handlecas(e){
    e.preventDefault();
      
      window.location.href='http://localhost:8080/cas'
  }

  handleSubmitsignup(e) {
    e.preventDefault();
    const { fname, lname, email, password, age ,username,contact} = this.state;
    this.setState({loader:true});
    fetch("http://localhost:8080/register", {
      method: "POST",
      crossDomain: "true",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
        contact,
        age,
        username,

      }),
    }).then((res) => res.json()).then((data) => {
      console.log(data, "user Registered")

      if (data.status === "ok") {
        //  window.location.reload(false);
        alert("Resgistered Successfully meri jaan");
        fetch("http://localhost:8080/login", {
          method: "POST",
          crossDomain: "true",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }).then((res) => res.json()).then((data) => {
          console.log(data, "user logged in")
          if (data.status === "ok") {
            // alert("login successful meri jaan");
            window.localStorage.setItem("token", data.data);
            window.localStorage.setItem("loggedIn", true);
            window.location.href = "/userprofile";
          }
          else {
            alert(data.error);
          }
        });

      }
      else {
        window.location.reload(false);
        alert(data.error);
      }
      this.setState({loader:true});
    });

  }
  render() {
    
    fetch("http://localhost:8080/cas", {
      method: "POST",
      crossDomain: "true",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
      }),
    }).then((res) => res.json()).then((data) => {
      alert(data.data);
    });
    // console.log(this.state);
    // const loggedin=window.localStorage.getItem("in");
    // const loggedup=window.localStorage.getItem("up");
    // console.log(this.state.loggedin+ ' login');
    // console.log(this.state.loggedup+ ' logup');
    // const x =this.state.loggedin;
    // const y =this.state.loggedup;
    // console.log(x+" in");
    // console.log(y+"up");
    // const {lname} =this.state;

    return (
      <> 
     {this.state.loader &&<Loader></Loader>}
        <div className='auth-inner1'>
          <div className="line1" >
          {!this.state.loader &&  <div>
            <form onSubmit={this.handleSubmit} >
              <h2 className='welcome'>Welcome to GREDDIIT :)</h2>
              <h3>Sign In</h3>

              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => this.setState({ s_email: e.target.value })}
                  // value={this.state.s_email}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => this.setState({ s_password: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                  />
                  <label className="custom-control-label" htmlFor="customCheck1">
                    Remember me  
                  </label>
                </div>
              </div>

              <div className="d-grid">
                <button disabled={!this.state.s_email || !this.state.s_password} type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <p className="forgot-password text-right">
                Forgot <a href="/forgot">password?</a>
              </p>
            </form>
            </div>}
        
      
         <div>
          <LoginSocialGoogle
            client_id={"996599200591-vafptc0p1p58hda6hj7e9nv5mmqjc6bh.apps.googleusercontent.com"}
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            onResolve={({ provider, data }) => {
              //  this.handleGoggle;
              // const copy=data.email;
              this.setState({loader:true})
              this.setState({ gemail: data.email });
              this.setState({ glname: data.family_name });
              this.setState({ gfname: data.given_name });
              // this.setState({ gcontact: "XXXXXXXXXX" });
              this.setState({ gage: "X" });
              this.setState({ gpassword: "x" });

              window.localStorage.setItem("G_auth", data.email_verified);

              // data=this.state;
              // console.log(this.state);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <GoogleLoginButton />
          </LoginSocialGoogle>
          </div>
          <button onClick={(e)=>this.handlecas(e)}>CAS</button>
          </div >




          <br />
          {!this.state.loader && 
          <div className="line">
            <form onSubmit={this.handleSubmitsignup} >
              <h3>Sign Up</h3>

              <div className="mb-3">
                <label>First name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  onChange={(e) => this.setState({ fname: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Last name</label>
                <input type="text"
                  className="form-control"
                  placeholder="Last name"
                  onChange={(e) => this.setState({ lname: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Username</label>
                <input type="text"
                  className="form-control"
                  placeholder="User Name"
                  onChange={(e) => this.setState({ username: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Contact No.</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter 10digit phone no."
                  onChange={(e) => this.setState({ contact: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Age No.</label>
                <input
                  type="age"
                  className="form-control"
                  placeholder="Age"
                  onChange={(e) => this.setState({ age: e.target.value })}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={!this.state.fname||!this.state.lname||!this.state.email||!this.state.username||!this.state.contact||!this.state.password||!this.state.age||this.state.age<=0||this.state.contact.length!==10}>
                  Sign Up
                </button>
              </div>

              <p className="forgot-password text-right">
                Already registered <a href="/sign-in">sign in?</a>
              </p>

            </form>
          </div>}
          </div>
      </>
    )
  }
}
