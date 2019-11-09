import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <nav>
          <Link to='/' style={{textDecoration: 'none'}}><h1 style={{fontFamily: "Special Elite", fontSize: "64px"}}>REACTive Music</h1></Link>  
          <Link to='/library' id="lib-link">Library</Link>
         </nav>
        </header>
        <main id="front-page"> 
          <Route exact path="/" component={Landing} /> 
          <Route path="/library" component={Library} />           
          <Route path="/album/:slug" component={Album} />
        </main>
      </div>
    );
  }
}

export default App;
