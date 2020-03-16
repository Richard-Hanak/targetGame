import React, { useState, useRef, useReducer } from "react";
import "./App.css";

function App() {
  const [menu, setMenu] = useState(true);
  const [y, setY] = useState("");
  const [x, setX] = useState("");
  const [target, setTarget] = useState(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const [lives, setLives] = useState(3);
  const livesRef = useRef(lives);
  livesRef.current = lives;

  console.log(menu);
  let timer;
  const gameLoop = () => {
    console.log(livesRef.current)
    const checkLives = () =>
      targetRef.current === true ? setLives(livesRef.current - 1) : null;
    checkLives();
    setY(Math.floor(Math.random() * 460));
    setX(Math.floor(Math.random() * 860));
    setTarget(true);
    if (scoreRef.current < 5 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 3000);
    } else if (scoreRef.current < 10 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 2000);
    } else if (scoreRef.current < 15 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 1000);
    } else if (scoreRef.current < 30 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 800);
    } else if (scoreRef.current < 40 && livesRef.current > 0) {
      timer = setTimeout(gameLoop, 700);
    } else if (livesRef.current > 0) {
      timer = setTimeout(gameLoop, 600);
    }
    if (livesRef.current <= 0) {
      setTarget(false);
      clearTimeout(timer);
    }
  };

  const handleClickShot = () => {
    setScore(score + 1);
    setTarget(false);
  };

  const handleClickStart = () => {
    setScore(0);
    setMenu(false);
    gameLoop();
  };

  return (
    <div className="gameScreen">
      {menu ? (
        <div className="menuWrapper">
          <p className="menu" onClick={handleClickStart}>START</p>
          <p className="menu">HIGH SCORE</p>
        </div>
      ) : (
        <div>
          {target ? (
            <div
              className="target"
              style={{ top: y, left: x }}
              onClick={handleClickShot}
            ></div>
          ) : null}
          <p className="score">SCORE: {score}</p>
          <p className="lives">LIVES: {lives}</p>
        </div>
      )}
      {lives <= 0 ? <div><p className="lose" >YOU LOSE!</p><p className="menu" onClick={() => {setMenu(true); setLives(3);}}> MENU</p></div> : null}
    </div>
  );
}

export default React.memo(App);
 