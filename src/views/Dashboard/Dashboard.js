import React, { useEffect, useState } from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
// @material-ui/icons
import Store from '@material-ui/icons/Store';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Update from '@material-ui/icons/Update';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import Accessibility from '@material-ui/icons/Accessibility';
import BugReport from '@material-ui/icons/BugReport';
import Code from '@material-ui/icons/Code';
import Cloud from '@material-ui/icons/Cloud';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SpeedIcon from '@material-ui/icons/Speed';
import ExploreIcon from '@material-ui/icons/Explore';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Table from 'components/Table/Table.js';
import Tasks from 'components/Tasks/Tasks.js';
import CustomTabs from 'components/CustomTabs/CustomTabs.js';
import Danger from 'components/Typography/Danger.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardIcon from 'components/Card/CardIcon.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';

// graphs
import Graphs from '../Graphs/Graphs.js';

import { bugs, website, server } from 'variables/general.js';

import { dailySalesChart, emailsSubscriptionChart, completedTasksChart } from 'variables/charts.js';

import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const useStyles = makeStyles(styles);

export default function Dashboard() {
  //Erlend hjelper!!!

  const [windSpeed, setWindSpeed] = useState();
  const [moneyEarned, setMoneyEarned] = useState();
  const [refresh, setRefresh] = useState();
  const [responses, setResponses] = useState([]);
  const [totalErnings, setTotalEarnings] = useState([]);
  //const [weatherApi, setWeatherApi] = useState([]);
  const [forecastWindSpeed, setForecastWindSpeed] = useState('');
  const [forecastTemperature, setForecastTemperture] = useState('');
  const [forecastAirPreasure, setForecastAirPreasure] = useState('');
  const [forecastHumidity, setForecastHumidity] = useState('');

  useEffect(() => {
    fetch('https://vindafor.azurewebsites.net/api/Weather')
      .then((response) => response.json())
      .then((data) => setWindSpeed(data));


//weather api
fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=57.1&lon=-2.1')
.then((weatherApi) => weatherApi.json())
.then((data) => {
  setForecastWindSpeed(data.properties.timeseries[0].data.instant.details.wind_speed);
  setForecastTemperture(data.properties.timeseries[0].data.instant.details.air_temperature);
  setForecastAirPreasure(data.properties.timeseries[0].data.instant.details.air_pressure_at_sea_level);
  setForecastHumidity(data.properties.timeseries[0].data.instant.details.relative_humidity);

} );




    fetch('https://vindafor.azurewebsites.net/api/PowerPrice')
      .then((response) => response.json())
      .then((data) => setMoneyEarned(data));
  }, [refresh]);





  useEffect(() => {
    setTimeout(() => setRefresh(''), 60000);
  }, [refresh]);

  useEffect(() => {
    //tom arve hjelper
    let myheaders = {
      GroupId: 'svg',
      GroupKey: 'ZW43OAUPlEKuqfMETg0izA==',
    };

    fetch('https://vindafor.azurewebsites.net/api/Windmills', {
      method: 'GET',

      headers: myheaders,
    })
      .then((response) => response.json())
      .then((data) => setResponses(data));
  }, [refresh]);



  useEffect(() => {
    //tom arve hjelper
    let myheaders = {
      GroupId: 'svg',
      GroupKey: 'ZW43OAUPlEKuqfMETg0izA==',
    };

    fetch('https://vindafor.azurewebsites.net/api/GroupState', {
      method: 'GET',

      headers: myheaders,
    })
      .then((totalErnings) => totalErnings.json())
      .then((data) => setTotalEarnings(data));
  }, [refresh]);
console.log(totalErnings);
function numberWithSpaces(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


  

  useEffect(() => {
    setTimeout(() => setRefresh(''), 60000);
  }, [refresh]);

  let activated = [];
  responses.map((value, index) => {
    activated.push(value.isActivated ? 1 : 0);
  });

  const activeSum = activated.reduce(function (a, b) {
    return a + b;
  }, 0);

  let currentEarnings;
  const maintainanceCostConst = 0;
  if (windSpeed < 3 || windSpeed > 25) {
    currentEarnings = 0;
  } else if (windSpeed > 12) {
    currentEarnings = -maintainanceCostConst - 76 * windSpeed + 4.8 * moneyEarned;
  } else {
    currentEarnings = -maintainanceCostConst - 76 * windSpeed + windSpeed * 0.4 * moneyEarned;
  }

  let activeWindmillsEarning = currentEarnings * activeSum;

  const classes = useStyles();
  return (

    <div>

<GridContainer>

<GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
          <SpeedIcon />         
           </CardIcon>
          <p className={classes.cardCategory}>Predicted air preasure 1 hour from now</p>
          <h3 className={classes.cardTitle}>
            {forecastAirPreasure} <small>hPa</small>
          </h3>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <div className={classes.stats}>
              <Update />
              Updated 1 minute ago
            </div>
          </div>
        </CardFooter>
      </Card>
    </GridItem>



    <GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
          <SpeedIcon />         
           </CardIcon>
          <p className={classes.cardCategory}>Predicted humidity 1 hour from now</p>
          <h3 className={classes.cardTitle}>
            {forecastHumidity} <small>%</small>
          </h3>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <div className={classes.stats}>
              <Update />
              Updated 1 minute ago
            </div>
          </div>
        </CardFooter>
      </Card>
    </GridItem>











<GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
          <SpeedIcon />         
           </CardIcon>
          <p className={classes.cardCategory}>Predicted wind speed 1 hour from now</p>
          <h3 className={classes.cardTitle}>
            {forecastWindSpeed} <small>m/s</small>
          </h3>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <div className={classes.stats}>
              <Update />
              Updated 1 minute ago
            </div>
          </div>
        </CardFooter>
      </Card>
    </GridItem>

    <GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
            <Cloud />
          </CardIcon>
          <p className={classes.cardCategory}>Predicted temperature 1 hour from now</p>
          <h3 className={classes.cardTitle}>
            {forecastTemperature} <small>Celsius</small>
          </h3>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <div className={classes.stats}>
              <Update />
              Updated 1 minute ago
            </div>
          </div>
        </CardFooter>
      </Card>
    </GridItem>




    <GridItem xs={12} sm={6} md={3}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
            <AttachMoneyIcon />
          </CardIcon>
          <p className={classes.cardCategory}>Total earnings currently accumulated from windmills</p>
          <h3 className={classes.cardTitle}>
            {numberWithSpaces(totalErnings.money)} <small>NOK</small>
          </h3>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <div className={classes.stats}>
              <Update />
              Updated 1 minute ago
            </div>
          </div>
        </CardFooter>
      </Card>
    </GridItem>

    
      <GridItem xs={3} sm={6} md={3}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <SpeedIcon />
            </CardIcon>

            <p className={classes.cardCategory}>Total earnings from current active windmills</p>
            <h3 className={classes.cardTitle}>
              {Math.round(activeWindmillsEarning)} <small>NOK</small>
            </h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>
              <div className={classes.stats}>
                <Update />
                Updated 1 minute ago
              </div>
            </div>
          </CardFooter>
        </Card>
      </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <SpeedIcon />
              </CardIcon>

              <p className={classes.cardCategory}>Wind Speed</p>
              <h3 className={classes.cardTitle}>
                {windSpeed} <small>m/s</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <div className={classes.stats}>
                  <Update />
                  Updated 1 minute ago
                </div>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <AttachMoneyIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Power price</p>
              <h3 className={classes.cardTitle}>
                {moneyEarned} <small>NOK/MWh</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Updated 1 minute ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="rose" stats icon>
              <CardIcon color="rose">
                <ExploreIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current earnings per windmill</p>
              <h3 className={classes.cardTitle}>
                {Math.round(currentEarnings)} <small>NOK</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Updated 1 minute ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <DoubleArrowIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current windmills running</p>
              <h3 className={classes.cardTitle}>
                {activeSum}
                <small> Active</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Updated 1 minute ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <Graphs />
    </div>
    
  );
}
