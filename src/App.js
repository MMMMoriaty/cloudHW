import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react'
import styles from './App.scss'
import moment from 'moment'

class App extends Component {
    state = {
        priceList: [],
        riseTimes: [],
        minusPrice: [],
    }

    componentWillMount() {
        fetch('http://47.106.199.254//getStockDataByDate/2018-10-29', {
            method: 'GET',
        }).then((res) => res.json()).then((json) => {
            let priceList = []
            for (let key in json.result) {
                priceList.push(json.result[key])
            }
            this.setState({
                priceList
            })
        })

        fetch('http://47.106.199.254/getMostRecentPriceRiseTimes', {
            method: 'GET',
        }).then((res) => res.json()).then((json) => {
            this.setState({
                riseTimes: json.result,
            })
        })

        fetch('http://47.106.199.254/getMostRecentMinusPrice', {
            method: 'GET',
        }).then((res) => res.json()).then((json) => {
            this.setState({
                minusPrice: json.result,
            })
        })
    }

    getPriceListData(list) {
        return list.map((v, k) => {
            return {
                name: v[0].name,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: v.map((j) => {
                    let time = moment(j.date + '/' + j.time, 'YYYY-MM-DD/HH:mm:ss')
                    return {
                        name: j.date + ' ' + j.time,
                        value: [time.valueOf(), j.curPrice * 100]
                    }
                })
            }


        })
    }

    render() {
        let priceListOption = {
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: ['20%', '20%'],
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: false
                }
            },
            series: this.getPriceListData(this.state.priceList),
            legend: {
                data: this.state.priceList.map((v) => v[0].name)
            },
            tooltip: {
                trigger: 'axis'
            },
        }
        let riseTimeOption = {
            color: ['#3398DB'],
            xAxis: [
                {
                    name: '股票名称',
                    type: 'category',
                    data: this.state.riseTimes.map((v) => v.stockData.name),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    name: '上涨次数',
                    type: 'value',
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    data: this.state.riseTimes.map((v) => v.times),
                    label: {
                        show: true,
                        position: 'inside',
                        color: 'black',
                        fontSize: 18,
                    }
                }
            ]
        }
        let minusPriceOption = {
            color: ['#3398DB'],
            xAxis: [
                {
                    name: '股票名称',
                    type: 'category',
                    data: this.state.minusPrice.map((v) => v.stockData.name),
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis: [
                {
                    name: '差值(元)',
                    type: 'value',
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    // data: this.state.minusPrice.map((v) => v.minus_price),
                    data: [10, 5, 5, -3, -7],
                    label: {
                        show: true,
                        position: 'inside',
                        color: 'black',
                        fontSize: 18,
                    }
                }
            ]
        }
        return (
            <div className={styles.AppContainer}>
                <div className={styles.block}>
                    <div className={styles.title}>各股价格走向</div>
                    <div>
                        <ReactEcharts
                            option={priceListOption}
                            notMerge={true}
                            lazyUpdate={true}
                        />
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.title}>上涨次数统计</div>
                    <div>
                        <ReactEcharts
                            option={riseTimeOption}
                            notMerge={true}
                            lazyUpdate={true}
                        />
                    </div>

                </div>

                <div className={styles.block}>
                    <div className={styles.title}>与上次价格差值统计</div>
                    <ReactEcharts
                        option={minusPriceOption}
                        notMerge={true}
                        lazyUpdate={true}
                    />
                </div>
            </div>
        );
    }
}

export default App;
