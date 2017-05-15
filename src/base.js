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
      },
      moment: 'amnistia28_12_2016'
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
    const { data, moment } = this.state;
    return data.map((person, index) => {
      const seat = seating[index];
      if (!seat) {
        console.log(person);
        return;
      }
      const siONo = person[moment];
      const { x, y } = seat;
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle
            className={cx(s.circle, s[siONo.replace(/\s/g,'')])}
            onMouseEnter={this.handleMouseEnter.bind(this, person.senador, x, y)}
            onMouseLeave={this.handleMouseLeave}
            partido={person.partido}
            r="6.67"
          />
        </g>
      )
    });
  }

  getBalloon() {
    const { balloon } = this.state;
    const { text, x = 50, y = 50 } = balloon;

    const hidden = (!text);

    return (
      <g className={cx(s.balloon, { [s.balloon__hidden]: hidden })} transform={`translate(${x}, ${y})`}>
        <g className={s.balloon__inner}>
          <rect className={s.balloon__rect} width="75" height="13" rx="2" />
          <text className={s.balloon__text} x="5" y="8">{text}</text>
        </g>
      </g>
    )
    // }
  }

  handleChange(moment) {
    this.setState({ moment });
  }

  render(props, state) {
    const names = this.getNames();
    const balloon = this.getBalloon();
    return (
      <div className={s.container}>
        <svg viewBox="0 0 360 185" className={s.svg}>
          <g>
            {names}
          </g>
          {balloon}
        </svg>

        <div className={s.buttons}>
          <button onClick={this.handleChange.bind(this, 'amnistia28_12_2016')}>
            Amnistía 28_12_2016
          </button>
          <button onClick={this.handleChange.bind(this, 'vocesDePaz14_02_2017')}>
            Voces de paz 14_02_2017
          </button>
          <button onClick={this.handleChange.bind(this, 'blindaje21_02_2017')}>
            Blindaje 21_02_2017
          </button>
          <button onClick={this.handleChange.bind(this, 'jEP13_03_2017')}>
            JEP 13_03_2017
          </button>
          <button onClick={this.handleChange.bind(this, 'conciliacionJep22_03_2017')}>
            Conciliación jep 22_03_2017
          </button>
          <button onClick={this.handleChange.bind(this, 'oposicion05_04_2017')}>
            Oposición 05_04_2017
          </button>
          <button onClick={this.handleChange.bind(this, 'partidoPoliticoFarc26_04_2017')}>
            Partido político farc 26_04_2017
          </button>
        </div>
      </div>
    )
  }
}