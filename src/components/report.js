import React from 'react';
import * as actions from '../actions/countries';
import { connect } from "react-redux";
import axios from 'axios';
import _ from 'lodash';
import { Pie} from 'react-chartjs-2';


class Report extends React.Component {

    state={
        active: '',
        country: ''
    }

    componentDidMount(){
        fetch(this.props.fetchCountryList())
            .then(res => {
                if (res) this.getPopulation()
            })
    }

    getPopulation(){

        //Current Time
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {dd = '0' + dd}
        if (mm < 10) {mm = '0' + mm}
        today = yyyy + '-' + mm + '-' + dd;

        let promiseArray = this.props.countries.map(country => axios.get('http://api.population.io/1.0/population/' + country + '/' + today +'/'));
        Promise.all(promiseArray)
            .then(
            results => {
                const ignore = ['ASIA', 'AFRICA', 'EUROPE', 'World', "Less developed regions", "Less developed regions, excluding China", "Less developed regions, excluding least developed countries", 'Least developed countries', 'More developed regions', 'LATIN AMERICA AND THE CARIBBEAN', 'NORTHERN AMERICA', 'South-Central Asia', 'Southern Asia', 'Eastern Asia', 'Sub-Saharan Africa', 'South-Eastern Asia', 'South America', 'Eastern Africa', 'Western Africa', 'Eastern Europe', 'Western Asia', 'Northern Africa', 'Western Europe', 'Central America', 'Middle Africa', 'Southern Europe', 'Northern Europe', 'Central Asia', 'Southern Africa', 'South Africa', 'OCEANIA']
                const countries = [];
                const country = this.props.countries.map((list,i)=>{
                    if (!_.includes(ignore, list)){
                        const obj = { country: list, population: results[i].data.total_population.population }
                        countries.push(obj)
                    }
                });
                this.props.getInfo(countries);
            }
        )}

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
        
        const countries = this.props.population.map((x, i)=>{
            return(
                <tr key={x.country}>
                    <td  onClick={() => { this.showChart(x.country) }}> {x.country}</td>
                    <td>{x.population}</td>
                </tr>
            )
        });
        
        return (
            <div className='wrapper'>                
                {this.props.population.length > 1 ? <div className='main'>
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
                            }
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
