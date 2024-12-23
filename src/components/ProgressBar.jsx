import { useEffect, useState } from "react";

export const ProgressBar = ({ TIMER }) => {
  const [remainingTime, setRemaningTime] = useState(TIMER);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("INTERVAL");
      setRemaningTime((prevTime) => prevTime - 10);
    }, 10);

    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <progress value={remainingTime} max={TIMER} />
    </>
  );
};
