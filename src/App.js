import React from 'react';
import Dashboard from './components/dashboard';
import Report from './components/report';

class App extends React.Component {

  state = {
    active: 'Report',
    menu: ['Report', 'Dashboard']
  }

  changeComponent(menu){
    this.setState(prevState=>({
      active: menu
    }))
  }

  render() {

    const menu = this.state.menu.map((menu, i)=>{
      return(
        <li 
          onClick={()=>this.changeComponent(menu)}
          key={i}>
          {menu}
        </li>
      )
    })

    return (

      <div className="App">
        <ul>
          {menu}
        </ul>
        {this.state.active === 'Report' ? <Report /> : <Dashboard />}
      </div>

    );
  }
}

export default App;