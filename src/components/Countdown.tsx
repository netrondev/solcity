import { useState, useEffect } from "react";

export function Countdown(props: { target: Date }) {
  //   const duration = moment().diff(moment(props.target));

  const [days, setdays] = useState(0);
  const [hours, sethours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const futureDate = new Date(props.target);
      const diff = futureDate.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setdays(days);
      sethours(hours);
      setminutes(minutes);
      setseconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {days > 0 && <span>{days} days&nbsp;</span>}
      {hours > 0 && <span>{hours} hours&nbsp;</span>}
      {minutes} minutes {seconds} seconds
    </span>
  );
}
