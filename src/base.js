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
        'voceriaAVocesDePaz14_02_2017',
        'blindajeDelAcuerdo21_02_2017',
        'justiciaEspecialParaLaPaz13_03_2017',
        'conciliacionJEP22_03_2017',
        'estatutoDeOposicion05_04_2017',
        'partidoPoliticoDeFarc26_04_2017'
      ],
      momentsResults: [],
      momentsData: [
        {
          "title": "Amnistía",
          "date": "28 12 2016",
          "description": "<p>Permite tramitar las amnistías e indultos para los guerrilleros, y el tratamiento especial para los miembros de las fuerzas militares.</p>"
        },
        {
          "title": "Vocería a Voces de paz",
          "date": "14 02 2017",
          "description": "<p>Le da vocería en las sesiones y plenarias a los seis miembros de la organización, que representan los intereses a las Farc en el Congreso.</p>"
        },
        {
          "title": "Blindaje del Acuerdo",
          "date": "21 02 2017",
          "description": "<p>Obliga a los siguientes dos gobiernos a implementar el Acuerdo.</p>"
        },
        {
          "title": "Justicia Especial para la Paz",
          "date": "13 03 2017",
          "description": "<p>La Justicia Especial para la Paz (JEP) es el sistema de justicia transicional. Crea el tribunal de paz para juzgar guerrilleros, militares y civiles involucrados en el conflicto.</p>"
        },
        {
          "title": "Conciliación de la JEP",
          "date": "22 03 2017",
          "description": "<p>Las diferencias en los textos de Senado y Cámara fueron votados en plenaria para que quedara una ley unificada.</p>"
        },
        {
          "title": "Estatuto de Oposición",
          "date": "05 04 2017",
          "description": "<p>Dicta las pautas para garantizar el acceso a la democracia de los partidos que se declaren en oposición al gobierno de turno a nivel local, regional y nacional.</p>"
        },
        {
          "title": "Partido político de Farc",
          "date": "26 04 2017",
          "description": "<p>Consigna la creación, condiciones y beneficios de la organización política a la que llegarán las Farc cuando dejen las armas y da 10 curules en el Congreso por dos periodos a ese partido.</p>"
        }
      ],
      partidos: []
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
    const { moments, partidos } = this.state;
    fetch(uri)
      .then((response) => {
        console.log(response.json);
        return response.json();
      }).then((json) => {
      const momentsResults = [];
      json.map((item) => {
        moments.map((moment, index) => {
          const itemMoment = item[moment];
          if (!momentsResults[index]) {
            momentsResults[index] = {
              'si': 0,
              'no': 0,
              'noEstaba': 0,
              'total': 0
            }
          }
          if (itemMoment === 'Sí') {
            momentsResults[index].si++;
          } else if (itemMoment === 'No') {
            momentsResults[index].no++;
          } else if (itemMoment === 'No estaba') {
            momentsResults[index].noEstaba++;
          }
          momentsResults[index].total++;
        });
        if (partidos.indexOf(item.partido) === -1) {
          partidos.push(item.partido)
        }
      });
      console.log(partidos);
      this.setState({ data: json, momentsResults, partidos });
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
      if (!siONo) console.log(person, currentMoment);
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

  getPartidos() {
    const { partidos } = this.state;

    return partidos.map((partido, index) => {
      return (
        <li partido={partido}><span className={cx(s.circle, s.partido)} partido={partido} /> {partido}</li>
      )
    });
  }

  render(props, state) {
    const { moment, momentsData, momentsResults } = state;
    const momentDescription = momentsData[moment];
    const results = momentsResults[moment];
    const si = (results) ? results.si : '',
      no = (results) ? results.no : '',
      noEstaba = (results) ? results.noEstaba : '';

    const names = this.getNames();
    const balloon = this.getBalloon();
    const partidos = this.getPartidos();

    return (
      <div className={s.container}>
        <div className={s.description}>
          <div>
            <h3>{momentDescription.title}</h3>
            <time>{momentDescription.date}</time>
            <div dangerouslySetInnerHTML={{ __html: momentDescription.description }} />
          </div>
        </div>
        <div className={s.graphic}>
          <svg viewBox="0 0 360 185" className={s.svg}>
            <g>
              {names}
            </g>
            <g transform="translate(140, 145)">
              <g>
                <circle className={cx(s.circle, s['Sí'])} fill="#fff" r="4" />
                <text font-size='9px' x="8" y="3">Voto a favor</text>
                <text font-size='9px' font-weight="bold" x="70" y="4">{si}</text>
              </g>
              <g transform="translate(0, 15)">
                <circle className={cx(s.circle, s['No'])} fill="#fff" r="4" />
                <text font-size='9px' x="8" y="3">Voto a contra</text>
                <text font-size='9px' font-weight="bold" x="70" y="4">{no}</text>
              </g>
              <g transform="translate(0, 30)">
                <circle className={cx(s.circle, s['NoEstaba'])} fill="#ccc" r="5" />
                <text font-size='9px' x="8" y="3">No estaba</text>
                <text font-size='9px' font-weight="bold" x="70" y="4">{noEstaba}</text>
              </g>
            </g>
            {balloon}
          </svg>

          <div className={s.rangeContainer}>
            <input
              type="range"
              min="0" max="6"
              value={moment}
              onChange={this.handleInputChange}
            />
            <div className={s.overlay}>
              <span className={s.point} />
              <span className={s.point} />
              <span className={s.point} />
              <span className={s.point} />
              <span className={s.point} />
              <span className={s.point} />
              <span className={s.point} />
            </div>
          </div>

          <ul className={s.conventions}>
            {partidos}
          </ul>
        </div>
        <div className="clearfix" />
      </div>
    )
  }
}