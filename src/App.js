import React, { useState, useRef } from "react";
import "./App.css";

const highScore = [
  { name: "XXX", score: 12 },
  { name: "AAA", score: 1 },
  { name: "SSS", score: 17 },
  { name: "DDD", score: 4 },
  { name: "TTT", score: 6 }
];

function compare(a, b) {
  let comparison = 0;
  if (a.score < b.score) {
    comparison = 1;
  } else if (a.score > b.score) {
    comparison = -1;
  }
  return comparison;
}

highScore.sort(compare);
console.log(highScore);

function App() {
  const [name, setName] = useState("");
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
    console.log(livesRef.current);
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

  const handleEndGame = () => {
    setMenu(true);
    setLives(3);
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

  const handleSubmit = e => {
    e.preventDefault();
    highScore.push({ name: name, score: score });
    highScore.sort(compare);
    highScore.splice(5);
    setMenu(true);
    setLives(3);
  };

  return (
    <div className="gameScreen">
      {menu ? (
        <div className="menuWrapper">
          <p className="menu" onClick={handleClickStart}>
            START
          </p>
          <ul className="ingred">
            HALL OF FAME
            {highScore.map((highScore, i) => (
              <li key={i}>
                {highScore.name}: {highScore.score}
              </li>
            ))}
          </ul>
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
      {lives <= 0 ? (
        <div>
          {score > highScore[4].score ? (
            <form onSubmit={handleSubmit}>
              <input
                placeholder="ENTER YOUR NAME"
                onChange={
                  (e => {
                    setName(e.target.value);
                  })
                }
              ></input>
              <button type="submit">SUBMIT</button>
              <p className="lose">NEW HIGH SCORE!</p>
            </form>
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
