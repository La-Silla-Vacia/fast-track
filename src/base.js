import {h, render, Component} from 'preact';
import cx from 'classnames';

import s from './base.css';
import seating from './paliament_seeting.json';
const data = require('../data/data.json');

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: [],
      balloon: {
        text: false,
        x: false,
        y: false
      }
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillMount() {
    this.setData();
  }

  setData() {
    let dataExists = true;
    let interactiveData;
    let dataUri;
    try {
      if (fast_track_data) {
        dataExists = true;
        interactiveData = fast_track_data;
      }
    } catch (e) {
      dataExists = false;
    }

    if (!dataExists) {
      this.setState({data: data});
    } else {
      if (interactiveData.dataUri) {
        dataUri = interactiveData.dataUri;
        this.fetchData(dataUri);
      }
    }
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        console.log(response.json);
        return response.json();
      }).then((json) => {
      this.setState({data: json});
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  handleMouseEnter(text, e) {
    this.setState({balloon: {
      text,
      x: e.layerX,
      y: e.layerY
    }});
  }

  handleMouseLeave() {
    this.setState({balloon: {
      text: false,
      x: false,
      y: false
    }})
  }

  getNames() {
    return this.state.data.map((person, index) => {
      const seat = seating[index];
      if (!seat) {
        console.log(person);
        return;
      }
      const {cx, cy} = seat;
      return (
        <circle
          cx={cx}
          cy={cy}
          classID={s.circle}
          onMouseEnter={this.handleMouseEnter.bind(this, person.senador)}
          onMouseLeave={this.handleMouseLeave}
          partido={person.partido}
          r="6.67"
        />
      )
    });
  }

  getBalloon() {
    const {balloon} = this.state;
    const {text, x, y} = balloon;

    if (text) {
      const style = {
        left: x,
        top: y
      };
      return (
        <div className={s.balloon} data-balloon-visible="true" data-balloon={text} data-balloon-pos="down" style={style} />
      )
    }
  }

  render(props, state) {
    const names = this.getNames();
    const balloon = this.getBalloon();
    return (
      <div className={s.container}>
        <svg viewBox="0 0 360 185">
          {names}
        </svg>
        {balloon}
      </div>
    )
  }
}