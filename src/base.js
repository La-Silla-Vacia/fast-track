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
      moment: 0,
      moments: [
        'amnistia28_12_2016',
        'vocesDePaz14_02_2017',
        'blindaje21_02_2017',
        'jEP13_03_2017',
        'conciliacionJep22_03_2017',
        'oposicion05_04_2017',
        'partidoPoliticoFarc26_04_2017'
      ],
      momentsData: [
        {
          "title": "Amnistía",
          "date": "28 12 2016",
          "description": "<p>Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis.</p>"
        },
        {
          "title": "Voces de paz",
          "date": "14 02 2017",
          "description": "<p>Maecenas sed diam eget risus varius blandit sit amet non magna. Cras mattis consectetur purus sit amet fermentum. Nulla vitae elit libero, a pharetra augue. Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus.</p>"
        },
        {
          "title": "Blindaje",
          "date": "21 02 2017",
          "description": "<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus. Donec id elit non mi porta gravida at eget metus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p>"
        },
        {
          "title": "JEP",
          "date": "13 03 2017",
          "description": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula porta felis euismod semper. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>"
        },
        {
          "title": "Conciliacion Jep",
          "date": "22 03 2017",
          "description": "<p>Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus.</p>"
        },
        {
          "title": "Oposicion",
          "date": "05 04 2017",
          "description": "<p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>"
        },
        {
          "title": "Partido Politico Farc",
          "date": "26 04 2017",
          "description": "<p>Donec sed odio dui. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>"
        }
      ]
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
    const { data, moment, moments } = this.state;
    return data.map((person, index) => {
      const seat = seating[index];
      if (!seat) {
        console.log(person);
        return;
      }
      const currentMoment = moments[moment];
      const siONo = person[currentMoment];
      const { x, y } = seat;
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle
            className={cx(s.circle, s[siONo.replace(/\s/g, '')])}
            onMouseEnter={this.handleMouseEnter.bind(this, person.senador, x, y)}
            onMouseLeave={this.handleMouseLeave}
            partido={person.partido}
            r="6.67"
          />
          {/*<circle*/}
          {/*className={cx(s.marker, s[siONo.replace(/\s/g, '')])}*/}
          {/*r="3"*/}
          {/*/>*/}
        </g>
      )
    });
  }

  getBalloon() {
    const { balloon } = this.state;
    let { text, x = 50, y = 50 } = balloon;
    x = (x) ? x : 0;
    y = (y) ? y : 0;
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

  handleInputChange(event) {
    this.setState({ moment: event.target.value });
  }

  render(props, state) {
    const { moment, momentsData } = state;
    const momentDescription = momentsData[moment];

    const names = this.getNames();
    const balloon = this.getBalloon();
    return (
      <div className={s.container}>
        <div className={s.description}>
          <div>
            <h3>{momentDescription.title}</h3>
            <time>{momentDescription.date}</time>
            <div dangerouslySetInnerHTML={{ __html: momentDescription.description }} />
          </div>
          <div>
            <ul className={s.legend}>
              <li>
                <span className={s.Si} /> Voto a favor
              </li>
              <li>
                <span className={s.No} /> Voto a contra
              </li>
              <li>
                <span className={s.NoEstaba} /> No estaba
              </li>
            </ul>
          </div>
        </div>
        <div className={s.graphic}>
          <svg viewBox="0 0 360 185" className={s.svg}>
            <g>
              {names}
            </g>
            {balloon}
          </svg>

          <input
            type="range"
            min="0" max="6"
            value={moment}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="clearfix" />
      </div>
    )
  }
}