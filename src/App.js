import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav';
import search_icon from './loupe.svg';
import back_arrow from './left-arrow.svg'

function CountryCard(props) {
  return (
    <div onClick={ () => props.func(props.data)} className="country-card">
      <div className="img-box" style={{ backgroundImage: `url(${props.data.flag})` }}></div>
      <div className="country-info">
        <h3>{props.data.name}</h3>
        <span>Population: {props.data.population}</span>
        <span>Region: {props.data.region}</span>
        <span>Capital: {props.data.capital}</span>
      </div>
    </div>
  );
}

function CountryInfo(props) {
  return (
    <div id="remove-country" className="country-detail flex-center">
      <img src={props.data.flag} alt="country flag"></img>
      <div className="more-info">
        <h3>{props.data.name}</h3>
        <div className="more-data">
          <div className="col1">
            <span><strong>Native Name:</strong> {props.data.nativeName}</span>
            <span><strong>Population:</strong> {props.data.population}</span>
            <span><strong>Region:</strong> {props.data.region}</span>
            <span><strong>Sub Region:</strong> {props.data.subregion}</span>
            <span><strong>Capital:</strong> {props.data.capital}</span>
          </div>
          <div className="col2">
            <span><strong>Top Level Domain:</strong> {props.data.topLevelDomain[0]}</span>
            <span><strong>Currency:</strong> {props.data.currencies[0].name}</span>
            <span><strong>Language:</strong> {props.data.languages[0].name}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      region: '',
      input: '',
      selectedData: []
    }

    this.getAPIData = this.getAPIData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.goInDepth  = this.goInDepth.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  getAPIData() {
    fetch(`https://restcountries.eu/rest/v2/name/${this.state.input}`)
      .then(res => res.text())
      .then(data => {
        try {
          data = JSON.parse(data);

          //Filter by region
          if (this.state.region !== '') {
            let dataFilter = []
            data.forEach(element => {
              if (element.region === this.state.region) {
                dataFilter.push(element);
              }
            });
            data = dataFilter;
          }

          this.setState({ data: data });
          console.log(data);
        }

        catch {
          console.log('error');
          this.setState({ data: [] });
        }

        var countries;
        if(data.length > 0){
          try {
            countries = this.state.data.map((data) => <CountryCard func={this.goInDepth} key={data.name} data={data} />);
          }
          catch {
            countries = <p id="none-found">No Countries Were Found</p>
          }
        }
        else {
          countries = <p id="none-found">No Countries Were Found</p>
        }
        ReactDOM.render(countries, document.getElementById("countries"));
      })

      

  }


  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  filterChange(event) {
    this.setState({
      region: event.target.value
    });

  }

  goInDepth(data){
    document.getElementById('main-screen').style.display = "none";
    document.getElementById('more-detail').style.display = "block";
    ReactDOM.render(<CountryInfo data={data}/>, document.getElementById('place-data'))
  }
  
  goBack(){
    document.getElementById('more-detail').style.display = "none";
    document.getElementById('main-screen').style.display = "block";
    ReactDOM.unmountComponentAtNode(document.getElementById('remove-country'));
  }

  componentDidMount() {
    console.log('mounted')
  }


  render() {
    console.log('render');

    return (
      <div className="App">
        <Nav />
        <div id="more-detail">
          <div onClick={this.goBack} id='back-button'>
            <img src={back_arrow} alt="go back"></img> 
            <span>Back</span>
          </div>
          <div id="place-data">

          </div>
        </div>
        <div id="main-screen" className="search-container">
          <div id="search-data" className="flex-center">
            <div id="input-canvas" className="flex-center">
              <img onClick={this.getAPIData} src={search_icon} alt="search icon"></img>
              <input placeholder="Search for a country.." type="text" onChange={this.handleChange} className="search-input"></input>
            </div>
            <select onChange={this.filterChange} className="filter-box">
              <option value="" disabled selected>Filter by Region</option>
              <option value={''}>All</option>
              <option value={'Africa'}>Africa</option>
              <option value={'Americas'}>Americas</option>
              <option value={'Asia'}>Asia</option>
              <option value={'Europe'}>Europe</option>
              <option value={'Oceania'}>Oceania</option>
            </select>
          </div>
          <div id="countries" className="countries">
          </div>
        </div>
      </div>
    );

  }
}

export default App;
