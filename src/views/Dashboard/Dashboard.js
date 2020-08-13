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
// import Graphs from '../Graphs/Graphs.js';

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

  useEffect(() => {
    fetch('https://vindafor.azurewebsites.net/api/Weather')
      .then((response) => response.json())
      .then((data) => setWindSpeed(data));

    fetch('https://vindafor.azurewebsites.net/api/PowerPrice')
      .then((response) => response.json())
      .then((data) => setMoneyEarned(data));
  }, [refresh]);

  useEffect(() => {
    setTimeout(() => setRefresh(''), 60000);
  }, [refresh]);

  useEffect(() => {
    //Atle hjelper
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
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
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
                {moneyEarned} <small>kr</small>
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
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <ExploreIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current earnings per hour</p> //
              <h3 className={classes.cardTitle}>
                {Math.round(currentEarnings)} <small>kr</small>
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
              <h3 className={classes.cardTitle}>{activeSum}</h3>
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Avg. Wind Speed (m/s)</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 25%
                </span>{' '}
                Updated 1 minuite ago
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Monthly Avg. Earnings</h4>
              <p className={classes.cardCategory}>Average Earnings From The Last 12 Months</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
