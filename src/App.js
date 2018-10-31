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
        fetch('http://47.106.199.254/getAllStockData', {
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
            if (k !== 2){
                return {
                    name: v[0].name,
                    type: 'line',
                    showSymbol: true,
                    hoverAnimation: false,
                    data: v.map((j) => j.curPrice)
                }
            }
        })
    }

    render() {
        let lenArr = this.state.priceList.map((v) => v.length)
        let max = Math.max.apply(null, lenArr)
        let timeArr
        this.state.priceList.map((v) => {
            if (v.length === max ){
                timeArr = v.map((v) => moment(parseInt(v.timestamp)).format('YYYY-MM-DD HH:mm'))
            }
        })
        let priceListOption = {
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: timeArr,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value',
                // boundaryGap: ['20%', '20%'],
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
                trigger: 'axis',
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
                    data: this.state.minusPrice.map((v) => v.minus_price),
                    // data: [10, 5, 5, -3, -7],
                    label: {
                        show: true,
                        position: 'top',
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
