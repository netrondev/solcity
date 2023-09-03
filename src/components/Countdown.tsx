import moment from "moment";
import { useState, useEffect } from "react";

export function Countdown(props: { target: Date }) {
  //   const duration = moment().diff(moment(props.target));

  const [days, setdays] = useState(0);
  const [houers, sethouers] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const futureDate = new Date(props.target);
      const diff = futureDate.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const houers = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setdays(days);
      sethouers(houers);
      setminutes(minutes);
      setseconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {days} days {houers} hours {minutes} minutes {seconds} seconds
    </>
  );
}
