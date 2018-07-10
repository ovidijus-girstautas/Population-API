import React from 'react';
import * as actions from '../actions/countries';
import { connect } from "react-redux";
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import _ from 'lodash';

class Dashboard extends React.Component {

    state={
        top: [],
        chartData: '', 
        rankOne: ' ',
        fetched: false
    }

    componentDidMount(){
        if(this.props.countries.length > 0){
            this.topTen()
            this.most()
            this.continents()
        }else{
            this.props.fetchCountryList()
        }
    }
    
    componentDidUpdate() {
        if (this.props.countries && !this.state.chartData) {
            this.topTen();
            this.most()
            this.continents()
        }
    }
    

    topTen(){
        try {
        const topTen = this.props.countries.sort(function (a, b) {
            return b.totalPopulation - a.totalPopulation;
        }).filter((item, i) => {
            return i < 10
        })

        const names = topTen.map(country => country.country);
        const numbers = topTen.map(country => country.totalPopulation);
        this.setState({
            chartData: {
                labels: names,
                datasets: [
                    {
                        data: numbers,
                        backgroundColor: [
                            'rgba(10, 99, 244, 0.6)',
                            'rgba(20, 99, 132, 0.6)',
                            'rgba(124, 99, 132, 0.6)',
                            'rgba(6, 244, 45, 0.6)',
                            'rgba(78, 99, 132, 0.6)',
                            'rgba(42, 99, 55, 0.6)',
                            'rgba(25, 19, 132, 0.6)',
                            'rgba(188, 99, 132, 0.6)',
                            'rgba(9, 99, 255, 0.6)',
                            'rgba(20, 162, 42, 0.6)'
                        ]
                    }
                ]
            }
        })
        } catch (error) {
            console.log('country list is empty');
        }
    }

    most(){
        const rankOne = this.props.countries.sort(function (a, b) {
            return b.disparity - a.disparity;
        }).filter((item, i) => {
            return i === 0
        })
        this.setState({
            rankOne,
            mostData: {
                labels: ['Males', 'Females'],
                datasets: [
                    {
                        data: [rankOne[0].malePopulation, rankOne[0].femalePopulation],
                        backgroundColor: [
                            'rgba(10, 99, 244, 0.6)',
                            'rgba(187, 99, 132, 0.6)'
                        ]
                    }
                ]
            }
        })
    }
    
    continents(){
        const countries = [];
        const population = [{ continent: "Asia", population: 4546174409}];
        try{ 
        axios.get('http://api.population.io/1.0/countries')
            .then((response) => {
                const ignore = ['AFRICA', 'EUROPE', 'NORTHERN AMERICA', 'South America', 'Australia']
                response.data.countries.forEach((list, i) => {
                    if (_.includes(ignore, list)) {
                        const obj = { country: list }
                        countries.push(obj)
                    }
                });
            })
            .then(() => {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) { dd = '0' + dd }
                if (mm < 10) { mm = '0' + mm }
                today = yyyy + '-' + mm + '-' + dd;

                let promises = [];

                for (let i = 0; i < countries.length; i++) {
                    promises.push(axios.get('http://api.population.io/1.0/population/' + countries[i].country + '/' + today + '/'))
                }
                axios.all(promises)
                    .then(results => {
                        results.forEach((item, i) => {
                            const object = { continent: countries[i].country, population: item.data.total_population.population }
                            population.push(object);
                        })
                    })
                    .then(res => {
                        this.setState({
                            continentData: {
                                labels: population.map(i => i.continent),
                                datasets: [
                                    {
                                        data: population.map(i => i.population),
                                        backgroundColor: [
                                            'rgba(10, 99, 244, 0.6)',
                                            'rgba(20, 99, 132, 0.6)',
                                            'rgba(124, 99, 132, 0.6)',
                                            'rgba(6, 244, 45, 0.6)',
                                            'rgba(78, 99, 132, 0.6)',
                                            'rgba(42, 99, 55, 0.6)'
                                        ]
                                    }
                                ]
                            }
                        })
            })
            }
        ) 
    }catch(error){
        console.log('FAIL');
    }           
    }
    
    render() {

        return (
            <div className='main'>
                <div className='container-fluid'>
                    <div className="animated fadeIn">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <h4>Top 10 population</h4>
                                </div>
                                <div className="chart-wrapper">
                                    {this.state.chartData ? <div className="chart-dashboard">
                                        <Bar
                                            data={this.state.chartData}
                                            height={300}
                                            options={{
                                                title: {
                                                    display: true,
                                                    text: 'Top 10 Countries by Population',
                                                    fontSize: 15,
                                                    fontColor: 'white'
                                                },
                                                legend: {
                                                    display: false
                                                },
                                                responsive: true,
                                                maintainAspectRatio: false
                                            }}
                                        />
                                    </div> : <div className="loader">Loading...</div>}
                                </div>
                            </div>
                        </div>
                        <div className="chart-container">
                        <div className="card half-card">
                        <div className="card-body">
                            <div className="row">
                                    <h4>Highest male to female ratio: {this.state.rankOne[0].country} with ratio of {Number(this.state.rankOne[0].disparity).toFixed(3)}</h4>
                            </div>
                                {this.state.mostData ? <div className="chart-dashboard">
                                    <Pie
                                        data={this.state.mostData}
                                        height={400}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Most Males',
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
                                </div> : <div className="loader">Loading...</div>}
                        </div>
                    </div>
                        <div className="card half-card">
                            <div className="card-body">
                                <div className="row">
                                    <h4>Continents</h4>
                                </div>
                                {this.state.continentData ? <div className="chart-dashboard">
                                    <Pie
                                        data={this.state.continentData}
                                        height={400}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Continents',
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
                                </div> : <div className="loader">Loading...</div>}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries
    }
};


export default connect(mapStateToProps, actions)(Dashboard)