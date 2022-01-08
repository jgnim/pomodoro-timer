import {useState, useEffect} from 'react';
import styled from 'styled-components';
import WebFont from 'webfontloader';
import {FiPlay, FiPause, FiRotateCcw} from 'react-icons/fi';
import Beep from '../audio/beep.wav'

WebFont.load({
  google: {
    families: ["Audiowide"]
  }
})

const Timer = () => {
  const seconds = 1;
  const minutes = 60;
  let countdown;
  const [sessionLength, setSession] = useState(5); 
  const [breakLength, setBreak] = useState(3);
  const [scale, setScale] = useState(seconds);
  const [phase, setPhase] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength*scale);
  const [remainingMinutes, setRemainingMinutes] = useState();
  const [remainingSeconds, setRemainingSeconds] = useState();
  const [radio, setRadio] = useState("seconds-scale");
  const [running, setRunning] = useState(false);
  
  useEffect(()=>{
    running ? 
      countdown = setInterval(()=>{
        setTimeLeft(prev => prev-1);
        }, 1000) 
      : clearInterval(countdown);    
    return () => clearInterval(countdown);
  }, [running])
  
  useEffect(()=>{  
    setPhase("Session");
    setTimeLeft(sessionLength*scale); 
  }, [sessionLength, scale])
   
  useEffect(()=>{
    display(timeLeft);
    if (timeLeft === 0) {  
      setRunning(false);     
      let sound = new Audio(Beep);
      sound.volume = 0.1;
      sound.play();   
      if (phase == "Session"){
        setTimeout(()=>{
          setPhase("Break");
          setTimeLeft(breakLength*scale);
          setRunning(true);
        }, 1500);        
      }
      else {
        setTimeout(()=>{
          setPhase("Session");
          setTimeLeft(sessionLength*scale);
          setRunning(true);
        }, 1500);
        
      }
    }
    return () => {
        clearTimeout();
    }
  }, [timeLeft]);

  //Decrementing time, time cannot be 0
  const decrement = (e) => {
    setRunning(false);
    if (e.target.value === "session" && sessionLength > 1) {
      setSession(prev => prev - 1);
    }
    else if (e.target.value === "break" && breakLength > 1) {
      setBreak(prev => prev - 1);
    }    
  }

  //Incrementing time
  const increment = (e) => {
    setRunning(false);
    if (e.target.value === "session") {
      setSession(prev => prev + 1);
    }
    else if (e.target.value === "break") {
      setBreak(prev => prev + 1);
    }    
  }

  const scaleChange = (e) => {
    setRunning(false);
    if (e.target.value === "seconds-scale") {
      setScale(seconds);
      setRadio(e.target.value);
    }
    else {
      setScale(minutes);
      setRadio(e.target.value);
    }
  }

  const display = (time) => {
    Math.floor(time/60) === 0 ? 
      setRemainingMinutes("00")
      : setRemainingMinutes(Math.floor(time/60));
    time%60 < 10 ? 
      setRemainingSeconds(`0${time%60}`)
      : setRemainingSeconds(time % 60);
  }

  const play = () => {
    setRunning(true);
  }

  const pause = (countdown) => {
    setRunning(false);
  }

  const reset = () => {
    setRunning(false);
    setPhase("Session");
    setTimeLeft(sessionLength*scale);
  }
  
  return (
    <Wrapper>
      <div>
        <h1>Pomodoro Timer</h1>
      </div>
      <form>
        <label>
          Scale
          <div>
          <label style={{padding: "10px"}} >
            <input type="radio" name="scale" value="seconds-scale" onChange={scaleChange} checked={radio==="seconds-scale"}/>            
            Seconds
          </label>
          <label style={{padding: "10px"}} >              
            <input type="radio" name="scale" value="minutes-scale" onChange={scaleChange} checked={radio==="minutes-scale"}/>
            Minutes
          </label> 
          </div> 
        </label>
      </form>
      <Selectors>
        <div>
          <h3>
            Session Length
          </h3>
          <Label id="session-label">
            <Button id="session-decrement" onClick={decrement} value="session"> - </Button>
            <div id="session-length">{sessionLength}</div>
            <Button id="session-increment" onClick={increment} value="session"> + </Button>
          </Label>
        </div>
        <div>
          <h3>
            Break Length
          </h3>
          <Label id="break-label">
            <Button id="break-decrement" onClick={decrement} value="break"> - </Button>
            <div id="break-length">{breakLength}</div>
            <Button id="break-increment" onClick={increment} value="break"> + </Button>
          </Label>
        </div>
      </Selectors>              
      <TimerWrapper>
        <div id="timer-label"> 
          {phase}
        </div>
        <div id="time-left">
          {remainingMinutes}:{remainingSeconds}
        </div>
      </TimerWrapper>
      <ControlButton>
        <Button id="start"><FiPlay onClick={play}/></Button>
        <Button id="stop"><FiPause onClick={pause}/></Button>
        <Button id="reset"><FiRotateCcw onClick={reset}/></Button>
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
  &:hover {
    cursor: pointer;
  }
`;

