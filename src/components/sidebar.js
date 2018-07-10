import React from 'react';
import { Link } from 'react-router-dom';


class Sidebar extends React.Component {
    state = {
        active: '',
        menu: ['Dashboard', 'Report']
    }

    changeComponent(menu) {
        this.setState(prevState => ({
            active: menu
        }))
    }
    render() {
        const menu = this.state.menu.map((menu, i) => {
            return (
                <Link to={"/" + menu} key={i} 
                onClick={() => this.changeComponent(menu)}
                style={this.state.active === menu ? {backgroundColor: 'red'} : null}
                className={'nav-item'}>
                    <li
                        key={i}>
                        {menu}
                    </li>
                </Link>
            )
        })
        return (
            <div className="App">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                        <ul className="nav">
                            {menu}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Sidebar;
