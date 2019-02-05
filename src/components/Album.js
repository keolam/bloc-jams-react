import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';


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
      currentTime: 0,
      duration: album.songs[0].duration, 
      currentVolume: 0.8,
      init: true,
      hoverSongSrc: '',
    };
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }
  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }
  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
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
  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    this.setState({init: false})
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }
  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }
  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = currentIndex + 1;
    const newSong = this.state.album.songs[newIndex];
    newIndex > (this.state.album.songs.length - 1) ? this.setState() : this.setSong(newSong);
    newIndex > (this.state.album.songs.length - 1) ? this.setState() : this.play();
  }
  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }
  handleVolumeChange(e) {
    const newVolume =  e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }
  formatTime(num) {
    let min = (Math.floor(num / 60)).toString();
    let sec = Math.floor(num % 60).toString();
    if (isNaN(num) || num === undefined) {
      return "-:--";
    }
    if (sec < 10) {
      return min + ':0' + sec;
    }
    return min + ':' + sec;
  }
  mouseEnter(song) {
    if (!this.state.isPlaying) {
      this.setState({
        hoverSongSrc: song.audioSrc,
      });
    }
  }
  mouseLeave(song) {
    this.setState({
      hoverSongSrc: '',
    });
  }
  showPlayOrPause(song) {
    if(this.state.currentSong.audioSrc ===  song.audioSrc && this.state.isPlaying) {
      return 'ion-md-pause';
    }
    return 'ion-md-play';
  }
  getPlayerPauseIcon(index, song) {
    if (this.state.currentSong.audioSrc === song.audioSrc && !this.state.init) {
      return <span className={`icon ${this.showPlayOrPause(song)}`}></span>
    }
    if (this.state.hoverSongSrc === song.audioSrc ) {
      return <span className={`icon ${this.showPlayOrPause(song)}`}></span>
    }
    return index + 1;
  } 
  songList() {
    return this.state.album.songs.map( (song, index) => { 
      return (
        <tr onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.mouseEnter(song)} onMouseLeave={() => this.mouseLeave(song)}>         
          <td><div style={{width: "30px" }}>{ this.getPlayerPauseIcon(index, song) }</div></td>
          <td><div style={{width: "500px" }}>{song.title}</div></td>
          <td><div style={{ textAlign: "right" }}>{this.formatTime(song.duration)}</div></td>
        </tr> 
        //  { `    ${ song.title }     ${ this.formatTime(song.duration) }`}      
      )
    }); 
  }
  
  render() {
    return (
      <section className="album"> 
        <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
        <section id="album-info">
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
          <table id="song-list">
            <colgroup>
              <col id="song-number-column" style={{width:"40%"}}/>
              <col id="song-title-column" />
              <col id="song-duration-column" />
            </colgroup>  
            <tbody>
              { this.songList() }
            </tbody>
          </table> 
          <PlayerBar 
            isPlaying={this.state.isPlaying} 
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            duration={this.audioElement.duration}
            timeInMin={this.formatTime(this.audioElement.currentTime)}
            durationInMin={this.formatTime(this.audioElement.duration)}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
          />
        </section>
      </section>
    );
  }
}

export default Album;
