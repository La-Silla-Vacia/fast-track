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
      let shape = (
        <path className={s.icon} transform="translate(0, -8)" d="M1.3,0.5C1.9,0.2,2.5,0,3.3,0c1,0,1.9,0.2,2.5,0.7s1,1.2,1,2.1c0,0.6-0.1,1.1-0.4,1.5c-0.2,0.2-0.5,0.6-1,0.9L4.9,5.6
		C4.7,5.8,4.5,6.1,4.4,6.3C4.4,6.5,4.3,6.8,4.3,7.1H2.5c0-0.8,0.1-1.3,0.2-1.6c0.1-0.3,0.4-0.6,0.9-1l0.5-0.4
		c0.2-0.1,0.3-0.3,0.4-0.4C4.7,3.5,4.8,3.3,4.8,3c0-0.3-0.1-0.7-0.3-0.9C4.3,1.8,3.9,1.6,3.4,1.6c-0.5,0-0.9,0.2-1.1,0.5
		C2,2.5,1.9,2.9,1.9,3.2H0C0.1,1.9,0.5,1,1.3,0.5z M2.5,8.1h2V10h-2V8.1z"/>
      );
      if (siONo === 'Sí') {
        shape = (
          <path transform="translate(-3, -6)" className={cx(s.icon, s.si)}
                d="M8.3,0L10,1.6L3.8,10L0,6.3l1.6-1.6l1.9,1.8L8.3,0" />
        )
      } else if (siONo === 'No estaba') {
        shape = (
          <polygon transform="translate(-3, -7)" className={s.icon} points="10,8.4 6.6,5 10,1.6 8.4,0 5,3.4 1.6,0 0,1.6 3.4,5 0,8.4 1.6,10 5,6.6 8.4,10 " />
        );
      }
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
          {/*{shape}*/}
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