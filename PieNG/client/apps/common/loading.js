import React, { Component } from 'react'

import './loader.scss'

export default class Circles extends Component {
  render() {
    return (
      <div className="pieLoading">
        <div className="hive-fading-circle">
          <div className="hive-circle1 hive-circle"></div>
          <div className="hive-circle2 hive-circle"></div>
          <div className="hive-circle3 hive-circle"></div>
          <div className="hive-circle4 hive-circle"></div>
          <div className="hive-circle5 hive-circle"></div>
          <div className="hive-circle6 hive-circle"></div>
          <div className="hive-circle7 hive-circle"></div>
          <div className="hive-circle8 hive-circle"></div>
          <div className="hive-circle9 hive-circle"></div>
          <div className="hive-circle10 hive-circle"></div>
          <div className="hive-circle11 hive-circle"></div>
          <div className="hive-circle12 hive-circle"></div>
        </div>
      </div>
    )
  }
} 

export class Dot extends Component {
  render() {
    return (
      <div className="pieLoading">
        <div class="hive-spinner">
          <div class="hive-dot1"></div>
          <div class="hive-dot2"></div>
        </div>
      </div>
    )
  }
}

export class ScaleOut extends Component {
  render() {
    return (
      <div className="pieLoading">
        <div className="hive-so-spinner"></div>
      </div>
    )
  }
}