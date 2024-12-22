import { useEffect, useState } from 'react';

const ProgressBar = ({ duration }: { duration: number }) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setWidth(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className='h-full bg-green-400 transition-all duration-100 ease-linear'
      style={{ width: `${width}%` }}
    />
  );
};

export default ProgressBar;
