import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function compare(a, b) {
  let comparison = 0;
  if (a.score < b.score) {
    comparison = 1;
  } else if (a.score > b.score) {
    comparison = -1;
  }
  return comparison;
}

function App() {
  const [highScore, setHighScore] = useState([]);
  const [name, setName] = useState("");
  const [menu, setMenu] = useState(true);
  const [lifeLost, setLifeLost] = useState(false);
  const [showCountDown, setShowCountDown] = useState(false);
  const [y, setY] = useState("");
  const [x, setX] = useState("");

  const [countDown, setCountDown] = useState(4);
  const countDownRef = useRef(countDown);
  countDownRef.current = countDown;

  const [target, setTarget] = useState(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const [lives, setLives] = useState(3);
  const livesRef = useRef(lives);
  livesRef.current = lives;

  useEffect(() => {
    const callBackendAPI = async () => {
      const response = await fetch("/express_backend");
      const body = await response.json();
      setHighScore(body);
      if (response.status !== 200) {
        throw Error(body.message);
      }
      return body;
    };
    callBackendAPI();
  }, []);

  const gameLoop = () => {
    let timer;
    const checkLives = () =>
      targetRef.current === true
        ? (setLives(livesRef.current - 1), setLifeLost(true))
        : null;
    checkLives();
    setY(Math.floor(Math.random() * 420));
    setX(Math.floor(Math.random() * 860));
    setTimeout(() => setLifeLost(false), 200);
    setTarget(true);
    if (scoreRef.current < 5 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 3000);
    } else if (scoreRef.current < 10 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 2000);
    } else if (scoreRef.current < 15 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 1000);
    } else if (scoreRef.current < 20 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 800);
    } else if (scoreRef.current < 30 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 700);
    } else if (livesRef.current > 0) {
      timer = setTimeout(gameLoop, 600);
    }
    if (livesRef.current <= 0) {
      timer = setTimeout(gameLoop, 3000);
      setLifeLost(false);
      setTarget(false);
      clearTimeout(timer);
    }
  };

  const handleEndGame = () => {
    setMenu(true);
    setScore(0);
    setLives(3);
  };

  const handleClickShot = () => {
    setScore(score + 1);
    setTarget(false);
  };

  const handleClickStart = () => {
    setShowCountDown(true);
    setMenu(false);
    const renderCountDown = () => {
      setCountDown(countDownRef.current - 1);
      if (countDownRef.current > 0) {
        setTimeout(renderCountDown, 1000);
      } else {
        setShowCountDown(false);
        gameLoop();
        setCountDown(4);
      }
    };
    renderCountDown();
  };

  const handleSubmit = e => {
    e.preventDefault();
    highScore.push({ name: name, score: score });
    highScore.sort(compare);
    highScore.splice(5);
    setMenu(true);
    setLives(3);
    setScore(0);
    fetch("/express_backend", {
      method: "POST",
      body: JSON.stringify(highScore),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => console.log(res));
  };

  return (
    <div className="gameScreen">
      {menu ? (
        <>
          <ul className="nav">
            <li className="start" onClick={handleClickStart}>
              START
            </li>
            <li className="start">GUIDE</li>
            <p className="tip">
              Shoot as many targets as possible.<br></br>
              Not shooting the target before another one appears = life lost.
              <br></br>
              The speed will increase when your score reaches 5/10/15/20/30.
              <br></br>
              <b>Good Luck!</b>
            </p>
            <li className="start">HIGHSCORE</li>
            <ul className="highScore">
              {highScore.map((highScore, i) => (
                <li key={i}>
                  <span className="Hscore-left">{highScore.name}</span>
                  <span className="Hscore-mid">:</span>
                  <span className="Hscore-right"> {highScore.score}</span>
                </li>
              ))}
            </ul>
          </ul>
        </>
      ) : (
        <>
          {lifeLost ? <div className="lifeLost"></div> : null}
          <div>
            {target ? (
              <div
                className="target"
                style={{ top: y + 40, left: x }}
                onClick={handleClickShot}
              ></div>
            ) : null}
            <p className="score">SCORE:{score}</p>
            <p className="lives">LIVES:{lives}</p>
          </div>
        </>
      )}
      {showCountDown ? <h1 className="countDown">{countDown}</h1> : null}
      {lives <= 0 ? (
        <div>
          {score > highScore[4].score ? (
            <>
              <p className="lose">NEW HIGH SCORE!</p>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="ENTER YOUR NAME"
                  maxLength="8"
                  minLength="3"
                  onChange={e => {
                    setName(e.target.value);
                  }}
                ></input>
                <button type="submit">SUBMIT</button>
              </form>
            </>
          ) : (
            <>
              <p className="lose">YOU LOSE!</p>
              <p className="menu" onClick={handleEndGame}>
                MENU
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(App);
