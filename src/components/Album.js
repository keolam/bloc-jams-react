import React, { Component } from 'react';
import albumData from './../data/albums';


class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });
    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      init: true
    };
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }
  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }
  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }  
  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }
  mouseEnter(song) {
    if (!this.state.isPlaying) {
      this.setState({togglePlay: true});
    }
  }
  mouseLeave(song) {
    this.setState({togglePlay: false});
    this.setState({currentSong: song})
  }
  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    this.setState({init: false})
    if (this.state.isPlaying && isSameSong) {
      this.pause();
      this.setState({paused: true})
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();   
      this.setState({paused: false})
    }
    
  }
  render() {
    const songs = this.state.album.songs.map( (song, index) => { 
      return (
        <tr onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.mouseEnter(song)} onMouseLeave={() => this.mouseLeave(song)}>      
          
          <span style={{ display: (this.state.currentSong === song && this.state.init === false )|| (this.state.togglePlay && this.state.currentSong === song)  ? 'inline'  : 'none' }}
                className={ !this.state.isPlaying || this.state.togglePlay ? 'icon ion-md-play' : 'icon ion-md-pause'}>{"    "}</span>
                 
               <span style={{ display:  this.state.currentSong !== song || this.state.init === true  ? 'inline'  : 'none' }}>{ index + 1 }</span>
                        
              { `${ song.title } ${ song.duration }`}      
              
        </tr> 
      )
    }); 
    return (
      <section className="album"> 
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>  
          <tbody text-align="center">
            { songs }
          </tbody>
        </table> 
      </section>
    );
  }
}

export default Album;
