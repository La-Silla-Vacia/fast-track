import { h, render, Component } from 'preact';
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
      this.setState({ data: data });
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
      this.setState({ data: json });
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  handleMouseEnter(text, x, y) {
    this.setState({
      balloon: {
        text,
        x,
        y
      }
    });
  }

  handleMouseLeave() {
    const { x, y } = this.state.balloon;
    this.setState({
      balloon: {
        text: false, x, y
      }
    })
  }

  getNames() {
    return this.state.data.map((person, index) => {
      const seat = seating[index];
      if (!seat) {
        console.log(person);
        return;
      }
      const { cx, cy } = seat;
      return (
        <circle
          cx={cx}
          cy={cy}
          classID={s.circle}
          onMouseEnter={this.handleMouseEnter.bind(this, person.senador, cx, cy)}
          onMouseLeave={this.handleMouseLeave}
          partido={person.partido}
          r="6.67"
        />
      )
    });
  }

  getBalloon() {
    const { balloon } = this.state;
    const { text, x, y } = balloon;

    const hidden = (!text);

    return (
      <g className={cx(s.balloon, { [s.balloon__hidden]: hidden })} transform={`translate(${x}, ${y})`}>
        <g className={s.balloon__inner} transform="translate(0%, -8px);">
          <rect className={s.balloon__rect} width="75" height="13" rx="2" />
          <text className={s.balloon__text} x="5" y="8">{text}</text>
        </g>
      </g>
    )
    // }
  }

  render(props, state) {
    const names = this.getNames();
    const balloon = this.getBalloon();
    return (
      <div className={s.container}>
        <svg viewBox="0 0 360 185">
          <g>
            {names}
          </g>
          {balloon}
        </svg>
      </div>
    )
  }
}