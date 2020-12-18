import { useRef, useState, useEffect, useCallback } from "react";

import Ball from './utils/Ball';
import { random } from './utils/mathUtils';

function App() {
  const amount = 10;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const requestRef = useRef(null);
  const [balls, setBalls] = useState([]);

  const addBallHandler = ({ nativeEvent} ) => {
    const { offsetX, offsetY } = nativeEvent;
    const size = random(10, 20);
    const newBall = new Ball(
      offsetX,
      offsetY,
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size
    );

    cancelAnimationFrame(requestRef.current);
    setBalls(prevState => [...prevState, newBall]);
  };

  const initBalls = (width, height) => {
    const balls = [...Array(amount)]
      .reduce(acc => {
        const size = random(10, 20);
        const newBall = new Ball(
          random(0 + size, width - size),
          random(0 + size, height - size),
          random(-7,7),
          random(-7,7),
          'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
          size
        );
        return [ ...acc, newBall ]
      }, []);

    setBalls(balls);
  };

  const loop = useCallback(() => {
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    contextRef.current.fillStyle = 'rgba(0, 0, 0, 0.25)';
    contextRef.current.fillRect(0, 0, width, height);

    balls.forEach(ball => {
      ball.draw(contextRef.current);
      ball.update(width, height);
    });

    requestRef.current = requestAnimationFrame(loop);
  }, [balls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 0, 0, 0.25)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    contextRef.current = context;
    initBalls(window.innerWidth, window.innerHeight);
  },[]);

  useEffect(() => {
    contextRef && loop();
  }, [contextRef, loop]);

  return (
    <canvas
      ref = { canvasRef }
      onMouseDown = { addBallHandler }
    />
  );
}

export default App;
