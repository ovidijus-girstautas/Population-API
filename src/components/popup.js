import React from 'react';
import { Pie } from 'react-chartjs-2';
import onClickOutside from "react-onclickoutside";

class Popup extends React.Component {
    handleClickOutside = evt => {
        this.props.hideTable()
    };
    render() {
        return (                
                    <div className='chart'>
                        <h1>{this.props.country}</h1>
                        <span onClick={() => this.props.hideTable()}>x</span>
                        <div className="pie">
                            <Pie
                                data={this.props.data}
                                height={400}
                                options={{
                                    title: {
                                        display: true,
                                        text: this.props.country + ' - Population by gender',
                                        fontSize: 15,
                                        fontColor: 'white'
                                    },
                                    legend: {
                                        display: true
                                    },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </div>
        );
    }
}

export default onClickOutside(Popup);
