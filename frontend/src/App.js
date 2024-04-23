import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { FaSignInAlt, FaUser, FaReddit,FaRocketchat,FaSave,FaAngellist} from 'react-icons/fa'
import Login from './components/login.component'
import SignUp from './components/signup.component'
import Userprofile from './components/userprofile'
import Forgot from './components/forgot'
import Editprofile from './components/editprofile'
import Mysub from './components/my_sub'
import Sub from './components/sub'
import Open from './components/open'
import Open1 from './components/open1'
import Chat_users from './components/chat_users'
import Saved from './components/saved_post'
import Chat from './components/chat'

function App() {
  const isloggedin=window.localStorage.getItem("loggedIn");

  return (

    <Router>
      <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/'}>
              <FaReddit className="move"/> Greddiit
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/'} onClick={()=>{ window.localStorage.setItem("in",true); window.localStorage.setItem("up",false); }}>
                    <FaSignInAlt /> Login / Sign-up ...
                  </Link>
                </li>
                <li className="nav-item" >
                  <Link className="nav-link" to={'/my_sub'} >
                  <FaUser />  My-Sub-greddiit
                  </Link>
                </li>
                <li className="nav-item" >
                  <Link className="nav-link" to={'/sub'} >
                  <FaAngellist />  Sub-greddiit
                  </Link>
                  </li>
                  <li className="nav-item" >
                  <Link className="nav-link" to={'/savedpost'} >
                  <FaSave />  Saved Post
                  </Link>
                  </li>
                  <li className="nav-item" >
                  <Link className="nav-link" to={'/chat'} >
                  <FaRocketchat />  Chat
                  </Link>
                  </li>
              </ul>
            </div>
          </div>
        </nav>

        <div >
          <div>

            <Routes>
              <Route exact path="/" element={isloggedin==="true" ?<Userprofile/>:<Login />} />
              <Route path="/sign-in" element={<Login />} /> 
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/userProfile" element={isloggedin==="true" ?<Userprofile/>:<Login />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path='/edit' element={isloggedin==="true" ?<Editprofile/>:<Login />}/>
              <Route path="/my_sub" element={isloggedin==="true" ?<Mysub/>:<Login/>}/>
              <Route path="/sub" element={isloggedin==="true" ?<Sub/>:<Login/>}/>
              <Route path="/open/:_id" element={isloggedin==="true" ?<Open/>:<Login/>}/>
              <Route path="/chat_users/:email" element={isloggedin==="true" ?<Chat_users/>:<Login/>}/>
              <Route path="/open1/:_id" element={isloggedin==="true" ?<Open1/>:<Login/>}/>
              <Route path="/savedpost" element={isloggedin==="true" ?<Saved/>:<Login/>}/>
              <Route path="/chat" element={isloggedin==="true" ?<Chat/>:<Login/>}/>
            </Routes>
          </div>
        </div>
      </div>
     
    </Router>
  )
}

export default App
