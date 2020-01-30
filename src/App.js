import React, {useState} from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import dictionary from './full-wordlist.json'
import solver from './boggle.js'
import ReactTimer from "@xendora/react-timer";


function App() {
  const [boggleboard, setboggleboard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [boggleSolution, setBoggleSolution] = useState(null);
  const [boggleSolutionMap, setBoggleSolutionMap] = useState(null);
  const [wordsFound, setWordsFound] = useState(new Set());
  const [alreadyFound, setAlreadyFound] = useState(null);
  const [textFieldState, setTextFieldState] = useState(true);
  const [wordsLeft, setWordsLeft] = useState(0);

  const listClasses = listUseStyles();
  let i = 0;

  // Returns a random 5x5 board, using the official letter distribution.
  function RandomGrid() {
    // prettier-ignore
    const dice = ["AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
                  "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
                  "CEIILT", "CEILPT", "CEIPST", "DHHNOT", "DHHLOR",
                  "DHLNOR", "DDLNOR", "EIIITT", "EMOTTT", "ENSSSU",
                  "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"];
    let chars = dice.map(cube => cube[Math.floor(Math.random() * cube.length)]);
    chars.sort(() => Math.random() - 0.5); // Shuffle the letters.

    const SIZE = 4;
    let grid = [];
    for (let row = 0; row < SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < SIZE; ++col) {
        grid[row][col] = chars[SIZE * row + col];
        if (grid[row][col] === "Q") grid[row][col] = "Qu";
      }
    }
    setboggleboard(grid);
    return grid;
  }

  function toggleBoard(){
    const board = RandomGrid();
    const solution = solver(board,dictionary.words);
    let solutionSet = new Set();

    for(let i =0; i<solution.length; i++){
      solutionSet.add(solution[i])
    }

    setBoggleSolution(new Set(solution));
    setBoggleSolutionMap(solution);
    setIsVisible(!isVisible);
    setWordsFound(new Set());
    setWordsLeft(solution.length);
    setTextFieldState(true);
    setAlreadyFound(null);
  }

  function recieveInput(value){
    if(boggleSolution.has(value.toUpperCase())){
      if(wordsFound.has(value)){
        setAlreadyFound(value);
      }else{
        setWordsFound(new Set([...wordsFound, value]));
        setWordsLeft(wordsLeft-1);
      }
    }
  }

  function endGame(){
    setWordsFound(new Set(boggleSolution));
    setTextFieldState(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2> SLOW BOGGLE! </h2>
        <h5> Sit back and enjoy the extra seconds :)</h5>
        {setTextFieldState && isVisible && <ReactTimer interval={800} start={50} end={t => t === 0} onTick={t => t - 1} onEnd={tickevent => endGame()}>
        {time => <h5>Time left: {time}</h5>}
        </ReactTimer>}
        {alreadyFound && <p>"You already found {alreadyFound}!"</p>}
        <Container maxWidth="md">
        {boggleboard && isVisible && <NestedGrid grid={boggleboard}/>}
        </Container>
        <Container maxWidth="md">
        {textFieldState && isVisible && <TextField justify="center" id="input" onChange={inputEvent => recieveInput(inputEvent.target.value)}/>}
        {!textFieldState && <TextField justify="center" disabled id="disabled" label="GAME OVER"/>}
        </Container>
        <button onClick={toggleBoard}>
        {isVisible ?
          ('New Board') :
          ('Play!')
        }
        </button>
        {isVisible && <button onClick={endGame}>
          End Game
        </button>}
        {isVisible && <h6>Words remaining: {wordsLeft}</h6>}
        {isVisible && boggleSolution && <List className={listClasses.root}>
        {[0].map(sectionId =>
          <li className={listClasses.listSection}>
              {boggleSolutionMap.map(item => (
                  <ListItemText primary={Array.from(wordsFound)[i++]} />
              ))}
          </li>
        )}
        </List>}
      </header>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

//Material UI nested grid
function NestedGrid({grid}) {
  const classes = useStyles();

  function FormRow({arr}) {
    return (
      <React.Fragment>
        <Grid item xs={2}>
          <Paper className={classes.paper}>{arr[0]}</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>{arr[1]}</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>{arr[2]}</Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>{arr[3]}</Paper>
        </Grid>
      </React.Fragment>
    );
  }
  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={2}>
        <Grid container justify="center" item xs={8} spacing={2}>
          <FormRow arr={grid[0]}/>
        </Grid>
        <Grid container justify="center" item xs={8} spacing={2}>
          <FormRow arr={grid[1]}/>
        </Grid>
        <Grid container justify="center" item xs={8} spacing={2}>
          <FormRow arr={grid[2]}/>
        </Grid>
        <Grid container justify="center" item xs={8} spacing={2}>
          <FormRow arr={grid[3]}/>
        </Grid>
      </Grid>
    </div>
  );
}

const listUseStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default App;
