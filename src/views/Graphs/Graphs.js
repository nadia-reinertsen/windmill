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

import { bugs, website, server } from 'variables/general.js';

import { dailySalesChart, emailsSubscriptionChart, completedTasksChart } from 'variables/charts.js';

import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const useStyles = makeStyles(styles);

const firebase = require('firebase');
require('firebase/firestore');

// const serviceAccount = require('vestavind-4105a90ed990.json');

const firebaseConfig = {
  apiKey: 'AIzaSyCi_gsFu2heycEimGHo-A_lG21tltFqCJs',
  authDomain: 'vestavind-92af4.firebaseapp.com',
  databaseURL: 'https://vestavind-92af4.firebaseio.com',
  projectId: 'vestavind-92af4',
  storageBucket: 'vestavind-92af4.appspot.com',
  messagingSenderId: '196036737737',
  appId: '1:196036737737:web:de9cefa3c5e4d6d69fab18',
};

firebase.initializeApp({
  apiKey: 'AIzaSyCi_gsFu2heycEimGHo-A_lG21tltFqCJs',
  authDomain: 'vestavind-92af4.firebaseapp.com',
  databaseURL: 'https://vestavind-92af4.firebaseio.com',
  projectId: 'vestavind-92af4',
  storageBucket: 'vestavind-92af4.appspot.com',
  messagingSenderId: '196036737737',
  appId: '1:196036737737:web:de9cefa3c5e4d6d69fab18',
});

const Graphs = () => {
  var Chartist = require('chartist');

  const classes = useStyles();
  const [latestWindspeeds, setLatestWindspeeds] = useState();
  const db = firebase.firestore();

  var logRef = db.collection('log').orderBy('timestamp', 'desc').limit(600);

  useEffect(() => {
    var speedList = [];

    logRef.onSnapshot({
      next: (querySnapshot) => {
        const data = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
        console.log(data);
        setLatestWindspeeds(data);
      },
    });
  }, [db]);

  var speeds = [];
  for (let i = 0; i < latestWindspeeds?.length; i++) {
    if (i % 60 === 0) {
      speeds.push(latestWindspeeds[i].windspeed);
    }
  }

  console.log(speeds);
  const labels = [
    '-1 hour',
    '-2 hours',
    '-3 hours',
    '-4 hours',
    '-5 hours',
    '-6 hours',
    '-7 hours',
    '-8 hours',
    '-9 hours',
    '-10 hours',
  ];

  const windSpeedData = {
    labels: labels.reverse(),
    series: [speeds.reverse()],
  };

  const options = {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0,
    }),
    low: 0,
    high: 25, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };

  var powerprice = [];
  for (let i = 0; i < latestWindspeeds?.length; i++) {
    if (i % 60 === 0) {
      powerprice.push(latestWindspeeds[i].powerprice);
    }
  }
  const powerpriceData = {
    labels: labels.reverse(),
    series: [powerprice.reverse()],
  };

  var currentEarningsList = [];
  var maintainanceCostConst;
  var price;
  var wSpeed;
  var currentEarnings;
  for (let i = 0; i < latestWindspeeds?.length; i++) {
    if (i % 60 === 0) {
      price = latestWindspeeds[i].powerprice;
      wSpeed = latestWindspeeds[i].windspeed;
      maintainanceCostConst = 0;
      if (wSpeed < 3 || wSpeed > 25) {
        currentEarnings = 0;
      } else if (wSpeed > 12) {
        currentEarnings = -maintainanceCostConst - 76 * wSpeed + 4.8 * price;
      } else {
        currentEarnings = -maintainanceCostConst - 76 * wSpeed + wSpeed * 0.4 * price;
      }
      currentEarningsList.push(currentEarnings);
    }
  }

  const currentEarningsData = {
    labels: labels.reverse(),
    series: [currentEarningsList.reverse()],
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="info">
            <ChartistGraph
              className="ct-chart"
              data={windSpeedData}
              type="Line"
              options={options}
              listener={dailySalesChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>
              Daily wind speed overview <small>(m/s)</small>
            </h4>
            <p className={classes.cardCategory}>
              <span className={classes.successText}>
                <ArrowUpward className={classes.upArrowCardCategory} />
              </span>{' '}
              Updated 1 minute ago
            </p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> Latest update
            </div>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="success">
            <ChartistGraph
              className="ct-chart"
              data={currentEarningsData}
              type="Line"
              options={completedTasksChart.options}
              listener={completedTasksChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>Earnings Last Ten Hours</h4>
            <p className={classes.cardCategory}>Current earnings from the last ten hours</p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> Updated just now
            </div>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="warning">
            <ChartistGraph
              className="ct-chart"
              data={powerpriceData}
              type="Line"
              options={completedTasksChart.options}
              listener={completedTasksChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>
              Daily power price overview <small>(NOK/MWh)</small>{' '}
            </h4>
            <p className={classes.cardCategory}> Updated 1 minuite ago</p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> Latest update
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default Graphs;
