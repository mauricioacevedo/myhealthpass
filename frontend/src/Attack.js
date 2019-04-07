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

let attack_results = [];

class Attack extends Component {


  constructor(props) {
    super(props);
    this.state = {
      number_of_attacks: 0,
      status: 'Ready!',
      attack_results
    };

    this.attack = this.attack.bind(this)
  }

  handleChange= event => {
    let number_of_attacks  =this.state.number_of_attacks;
    number_of_attacks=event.target.value
    this.setState({
        number_of_attacks,
        attack_results: []
    });
  };

  async attack(event){

    const number=this.state.number_of_attacks;

    this.setState({
        number_of_attacks: 0
    });

    let attack_results  =this.state.attack_results

    for(let i=0;i<number;i++){
        const username="bad.user"+i+"@gmail.com";
        const password="Kansascity1*";
        let res2= await fetch('http://localhost:40001/login?username='+username
                +'&password='+password, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            
        }).then(res=>{return res.json()});

        attack_results.push("[USERNAME]:"+username+", [PASSWORD]: "+password+",[RESULT]: "+res2.status+": "+res2.error);
          this.setState({
            attack_results: attack_results
        });
        setTimeout(() => {
            
        }, 100);
    }
        
  }

  render() {
    const { classes } = this.props;

    let log_attacks = this.state.attack_results.map(function(item){
        return <li> {item} </li>;
      });

    return (
      
      <div className="Register">
      <form  align="center">
      <br/>
    <h2>Brute Force Attack!!!</h2>  
    <p>This test executes the LOGIN event with diferent usernames and password to see the MyHealthPass component behavior.</p>

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
        label="Number of fake logins"
        //className={classes.textField}
        placeholder="Use your email."
        onChange={this.handleChange}
        margin="normal"
        variant="outlined"
        name="fake_logins_number"
        value={this.state.number_of_attacks}
      /><br/>

        <Button variant="contained" color="primary"
        className={classNames(classes.margin, classes.cssRoot)}
        //type="submit"
        onClick={this.attack}
        >
        Attack!!!
        </Button>


      </form>
      <center><div className="status-text"> {this.state.status}</div></center>
        <ul>
        {log_attacks}
        </ul>

      </div>
      
    );
  }
}

Attack.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Attack);