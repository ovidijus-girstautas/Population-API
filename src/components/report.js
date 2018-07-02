import React from 'react';
import * as actions from '../actions/countries';
import { connect } from "react-redux";
import axios from 'axios';
import { Pie} from 'react-chartjs-2';


class Report extends React.Component {

    state={
        active: '',
        country: ''
    }

    componentDidMount(){
        this.props.fetchCountryList();
    }

    showChart= (country) =>{
        var today = new Date();
        var year = today.getFullYear();
        axios.get('http://api.population.io/1.0/population/'+year+'/'+country+'/')
        .then(response=>{
            const females = response.data.reduce((total, data) => {
                return total + data.females
            }, 0);
            const males = response.data.reduce((total, data) => {
                return total + data.males
            }, 0);
            this.setState({
                country: response.data[0].country,
                chartData: {
                    labels: ['Females', 'Males'],
                    datasets: [
                        {
                            data: [
                                females, males
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(20, 162, 235, 0.6)'
                            ],
                            borderColor: [
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                        }
                    ]
                }
            })
        })
    }
    



    render() {     
        
        const countries = this.props.countries.map((country, i)=>{
            return(
                <tr key={country.country}>
                    <td  onClick={() => { this.showChart(country.country) }}> {country.country}</td>
                    <td>{country.population}</td>
                </tr>
            )
        });
        
        return (
            <div className='wrapper'>                
                {this.props.countries.length > 1 ? <div className='main'>
                    <div className='container'>
                        <table>
                            <tbody>
                            <tr>
                                <th onClick={() => { this.props.sortByName() }}>Country</th>
                                <th onClick={() => { this.props.sortByPopulation() }}>Population</th>
                            </tr>
                            {countries}
                            </tbody>
                        </table>
                    </div>
                </div> : null}
                {this.state.country ? <div className='chart'>
                    <Pie
                        data={this.state.chartData}
                        height={500}
                        options={{
                            title: {
                                display: true,
                                text: this.state.country +' - Population by gender',
                                fontSize: 15,
                                fontColor: 'white'
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries,
        population: state.population
    }
};


export default connect(mapStateToProps, actions)(Report)
