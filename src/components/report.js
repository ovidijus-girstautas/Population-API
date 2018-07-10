import React from 'react';
import * as actions from '../actions/countries';
import { connect } from "react-redux";
import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import Popup from '../components/popup';
import "react-table/react-table.css";


class Report extends React.Component {

    state={
        active: '',
        country: '',
        updated: false,
        show: false
    }

    componentDidMount(){
        if(!this.props.countries.length && this.props.location.pathname === "/Report"){
            this.props.fetchCountryList()
        } else if (this.props.countries.length > 0 && this.props.location.pathname !== "/Report"){
        } else {
            this.props.fetchCountryList()
        }
    }

    componentDidUpdate() {
        if (this.props.location.pathname !== "/Report" && this.props.countries.length > 0 && this.state.updated === false) {
            this.props.countries.sort((country) => {
                return country.country === this.props.match.params.country
            }).forEach(country =>{
                this.setState({
                    country: country.country,
                    chartData: {
                        labels: ['Females', 'Males'],
                        datasets: [
                            {
                                data: [
                                    country.femalePopulation, country.malePopulation
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
                    },
                    show: true,
                    updated: true
                })
            })
        }
    }
    
    hideTable =()=>{
        this.setState(prevState => ({
            show: false
        }));
    }


    render() {     

        return (
            <div className="main">
                <ReactTable
                    data={this.props.countries}
                    filterable
                    columns={[
                        {
                            Header: "Country",
                            accessor: "country",
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["country"] }),
                            filterAll: true,

                        },
                        {
                            Header: "Population",
                            accessor: "totalPopulation",
                            filterable: false
                        }
                    ]}
                    defaultPageSize={25}
                    className="-striped -highlight"
                    getTdProps={(state, rowInfo) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.props.history.push(`/Report/${rowInfo.original.country}`)
                                this.setState({
                                    country: rowInfo.original.country,
                                    chartData: {
                                        labels: ['Females', 'Males'],
                                        datasets: [
                                            {
                                                data: [
                                                    rowInfo.original.femalePopulation, rowInfo.original.malePopulation
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
                                    },
                                    show: true
                                })

                                if (handleOriginal) {
                                    handleOriginal();
                                }
                            }
                        };
                    }}
                />
                {this.state.show === true ?
                <div className='container'>
                    <Popup
                        country={this.state.country}
                        hideTable={this.hideTable}
                        data={this.state.chartData}
                        /> </div>: null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries
    }
};


export default connect(mapStateToProps, actions)(Report)
