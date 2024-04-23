import React, { Component } from 'react'
import video1 from "../vedio.mp4";
import Loader from './Loader';
export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      play: false,
      loader: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    this.setState({ play: true });
    e.preventDefault();
    const { email } = this.state;
    // console.log(email,password);
    this.setState({ loader: true });
    fetch("http://localhost:8080/forgot-password", {
      method: "POST",
      crossDomain: "true",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email,

      }),
    }).then((res) => res.json()).then((data) => {
      console.log(data, "user logged in");
      this.setState({ loader: false });
      alert(data.status);


    });
  }
  render() {
    return (
      <>
        {this.state.loader && <Loader></Loader>}
        {!this.state.loader && 
          <div className='auth-inner1'>
            {/* <h1 >Password bhulne vale Ladke ...</h1>
            <video className='move' width="100%" height="60%" controls src={video1} style={{ "marginTop": "10px" }} autoPlay={this.state.play}>
              Sorry, your browser doesn't support videos.
            </video> */}
            <div className='line'>
              <form onSubmit={this.handleSubmit}>
                <h1>
                  Forgot password
                </h1>
                <div className="mb-3">
                  <label>Enter your email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email."
                    onChange={(e) => this.setState({ email: e.target.value })}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>}
        </>
    )
  }
}