import {useState, useEffect} from 'react';
import styled from 'styled-components';
import useCountdown from 'react-countdown-hook';
import WebFont from 'webfontloader';
import format from 'format-duration';
import {FiPlay, FiPause, FiRotateCcw} from 'react-icons/fi';
import Beep from '../audio/beep.wav';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

WebFont.load({
  google: {
    families: ["Audiowide"]
  }
})

const Timer = () => {
  //All time is in miliseconds
  const seconds = 1000;
  const minutes = 1000*60;
  const [sessionLength, setSession] = useState(5); 
  const [breakLength, setBreak] = useState(3);
  const [scale, setScale] = useState(seconds);
  const [phase, setPhase] = useState("Session");
  const [display, setDisplay] = useState();
  const [timeLeft, {start, pause, resume, reset}] = useCountdown(sessionLength*scale);
  
  useEffect(()=>{
    setPhase("Session");
    start(sessionLength*scale);
    setDisplay(format(timeLeft));  
    pause(); 
  }, [])
  
  useEffect(()=>{     
    reset();
    setPhase("Session");        
    start(sessionLength*scale);    
    setDisplay(format(timeLeft));
  }, [sessionLength, scale])
   
  useEffect(()=>{
    setDisplay(format(timeLeft));    
    if (timeLeft === 0) {       
      let sound = new Audio(Beep);
      sound.volume = 0.3;
      sound.play();   
      if (phase == "Session"){
        setTimeout(()=>{
          setPhase("Break");
          start(breakLength*scale);
          setDisplay(format(timeLeft));  
        }, 1500);        
      }
      else {
        setTimeout(()=>{
          setPhase("Session");
          start(sessionLength*scale);
          setDisplay(format(timeLeft));
        }, 1500);
        
      }
    }
    return () => {
        clearTimeout();
    }
  }, [timeLeft]);

  //Decrementing time, time cannot be 0
  const decrement = (e) => {
    if (e.target.value === "session" && sessionLength > 1) {
      setSession(prev => prev - 1);
    }
    else if (e.target.value === "break" && breakLength > 1) {
      setBreak(prev => prev - 1);
    }    
  }

  //Incrementing time
  const increment = (e) => {
    if (e.target.value === "session") {
      setSession(prev => prev + 1);
    }
    else if (e.target.value === "break") {
      setBreak(prev => prev + 1);
    }    
  }

  const resetTimer = () => {    
    reset();
    setPhase("Session");
    start(sessionLength*scale);
  }

  const scaleChange = (e) => {    
    if (e.target.value == "seconds") {
      reset();
      setScale(seconds);
      setPhase("Session");
      start(sessionLength*scale);
    }
    else {
      reset();
      setScale(minutes);
      setPhase("Session");
      start(sessionLength*scale);
    }
  }
  
  return (
    <Wrapper>
      <div>
        <h1>Pomodoro Timer</h1>
      </div>
      <FormControl component="fieldset">
        <FormLabel component="legend" color="success">
          <span style={{color: "white"}}>Scale</span>
        </FormLabel>
        <RadioGroup row aria-label="scale" defaultValue="seconds" name="row-radio-buttons-group" onChange={scaleChange}>
          <FormControlLabel value="seconds" control={<Radio />} label="Seconds" />
          <FormControlLabel value="minutes" control={<Radio />} label="Minutes" />
        </RadioGroup>
      </FormControl>      
      <Selectors>
        <Session>
          <h3>
            Session Length
          </h3>
          <Label id="session-label">
            <Button id="session-decrement" onClick={decrement} value="session"> - </Button>
            <div id="session-length">{sessionLength}</div>
            <Button id="session-increment" onClick={increment} value="session"> + </Button>
          </Label>
        </Session>
        <Break>
          <h3>
            Break Length
          </h3>
          <Label id="break-label">
            <Button id="break-decrement" onClick={decrement} value="break"> - </Button>
            <div id="break-length">{breakLength}</div>
            <Button id="break-increment" onClick={increment} value="break"> + </Button>
          </Label>
        </Break>
      </Selectors>              
      <TimerWrapper>
        <div id="timer-label"> 
          {phase}
        </div>
        <div id="time-left">
          {display}
        </div>
      </TimerWrapper>
      <ControlButton>
        <Button id="start"><FiPlay onClick={resume}/></Button>
        <Button id="stop"><FiPause onClick={pause}/></Button>
        <Button id="reset"><FiRotateCcw onClick ={resetTimer}/></Button>
      </ControlButton> 
    </Wrapper>
  ) 
}

export default Timer;

const Wrapper = styled.div`  
  font-family: "Audiowide";
  font-size: 1.5em;
  color: white;
  width: 600px;
  margin: auto;
  margin-top: 50px;
  @media only screen and (max-width: 600px) {
    width: 100%;
    margin-top: 0px;
  }
`;

const Selectors = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Label = styled.div`
  display: flex;
  justify-content: space-evenly`

const ControlButton = styled(Label)`
  margin-top: 5%;
  justify-content: space-evenly;
`

const Session = styled.div``;
const Break = styled.div``;

const TimerWrapper = styled.div`
  position: relative;  
  border: 5px solid #112647;
  border-radius: 50px;
  width: 200px;
  margin: auto;
  margin-top: 15px;
  padding: 30px;  
`;

const Button = styled.button`
  background-color: transparent;
  border: 0px;
  color: white;
  font-size: 1em;
  padding-left: 20px;
  padding-right: 20px;  
`;

