import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import orange from '@material-ui/core/colors/deepOrange';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: orange[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: orange[500],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: orange[500],
    },
  },
  notchedOutline: {},
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },

  select: {
    '&:before': {
        borderColor: orange[500],
    },
    '&:after': {
        borderColor: orange[500],
    }
  },

  cssRoot: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
    '&:hover': {
      backgroundColor: orange[700],
    },
  },

});

class Login extends Component {


  constructor(props) {
    super(props);
    this.state = {
      user: {},
      status: 'Ready!'
    };

    this.login = this.login.bind(this)
  }

  handleChange= event => {
    let user  =this.state.user;
    user[event.target.name]=event.target.value
    this.setState({
       user,
    });
  };

  login(event){
    console.log(event);
    event.preventDefault();
        let user  =this.state.user

        fetch('http://localhost:40001/login?username='+user.username
                +'&password='+user.password, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
            
        })
        .then(res=>{return res.json()})
        .then(res2=>{
          console.log(res2);
          if(res2.status.indexOf('OK')!==-1){//ok
              res2.status="Token: "+res2.token
          }else if(res2.error.indexOf('ERROR')!==-1){//error
            res2.status=res2.error;
          }
          this.setState({
            status: res2.status
        });
        }).catch(err=>{
          console.log(err);
        })
  }

  render() {
    const { classes } = this.props;
    return (
      
      <div className="Register">
      <form  align="center" onSubmit={this.login}>
      <br/>
      <h2>Simple Login</h2>  
        <p>Test the LOGIN operation.</p>

      <TextField
        className={classes.margin}
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline,
          },
        }}
        label="Username"
          //className={classes.textField}
          placeholder="Use your email."
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
          name="username"
      /><br/>
      <TextField
        className={classes.margin}
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline,
          },
        }}
        label="Password"
          //className={classes.textField}
          placeholder="Your secret word."
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
          name="password"
          type="password"
      /><br/>

        <Button variant="contained" color="primary"
        className={classNames(classes.margin, classes.cssRoot)}
        type="submit"
        >
        Login
        </Button>


      </form>
      <center><div className="status-text"> {this.state.status}</div></center>

      </div>
      
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
