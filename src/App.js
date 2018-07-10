import React from 'react';
import Dashboard from './components/dashboard';
import Report from './components/report';
import Sidebar from './components/sidebar';
import './style/main.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as actions from './actions/countries';
import { connect } from "react-redux";





class App extends React.Component {

  componentDidMount() {
    if(this.props.countries.length < 0){
      this.props.fetchCountryList()
    }
  }

  render() {

    return (
      <BrowserRouter>
        <div>
          <Sidebar />
          <Switch>
            <Route path="/report/:country" component={Report} />
            <Route path="/report" component={Report} exact/>
            <Route path="/" component={Dashboard} />
          </Switch>
        </div>
      </BrowserRouter>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    countries: state.countries
  }
};


export default connect(mapStateToProps, actions)(App)
