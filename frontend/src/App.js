import React, { Component,Fragment } from 'react';
import Register from './Register';
import Login from './Login';
import Attack from './Attack';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import orange from '@material-ui/core/colors/deepOrange';
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";

const styles=  {
  root: {
    flexGrow: 1,
  },

  default_tabStyle:{
    color: 'black',
    fontSize:10,
    
   },
   
  active_tabStyle:{
    fontSize:11,
    color: 'black',
   },
   indicator: {
    backgroundColor: orange[500],
  },
};

class App extends Component {

  state = {
    value: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };

  }


  handleChange = (event, value) => {
    this.setState({ value });
  };
   
  render() {
    const { classes } = this.props;

    return (
      <BrowserRouter>
      <div className="title">
      <center><h1>My Health Pass Basic Client</h1></center>
      <br/>
      
      <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Tabs value={this.state.value}  
            onChange={this.handleChange}
            variant="fullWidth"
            scrollButtons="auto"
            classes={{
              indicator: classes.indicator
            }}
              >
                <Tab label="Register" component={Link} to="/myhealthpass/register" className=
            {this.state.value===0 ? classes.active_tab :classes.default_tabStyle} />
                <Tab label="Login" component={Link} to="/myhealthpass/login" className=
            {this.state.value===1 ? classes.active_tab :classes.default_tabStyle} />
                <Tab
                  label="Attack!!!"
                  component={Link}
                  to="/myhealthpass/attack"
                  className=
            {this.state.value===2 ? classes.active_tab :classes.default_tabStyle}
                />
              </Tabs>

              <Switch>
                <Route path="" render={() => <Register/>} />
                <Route path="./register" render={() => <Register/>} />
                <Route path="./login" render={() => <Login/>} />
                <Route path="./attack" render={() => <Attack/>} />
              </Switch>
            </Fragment>
          )}
        />      
      
      </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
