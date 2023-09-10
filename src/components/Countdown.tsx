import Head from "next/head";
import { useState, useEffect } from "react";

export function Countdown(props: { target: Date }) {
  const [init, setInit] = useState(false);

  const [days, setdays] = useState(0);
  const [hours, sethours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);

  function UpdateTimer() {
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
  }

  useEffect(() => {
    if (!init) {
      UpdateTimer();
      setInit(true);
    }

    const interval = setInterval(() => {
      UpdateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function toString() {
    if (!props.target) return;
    let output = "";

    if (days > 0) output += `${days}d`;
    if (hours > 0) output += `${hours}h`;
    output += `${minutes}m${seconds}s`;

    return output;
  }

  return (
    <>
      <Head>
        <title>Solcity {toString()}</title>
        <meta
          name="Sol City the best way to win"
          content="Build during the 2023 Solana hyperdrive hackathon"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <span>
        {days > 0 && <span>{days} days&nbsp;</span>}
        {hours > 0 && <span>{hours} hours&nbsp;</span>}
        {minutes} minutes {seconds} seconds
      </span>
    </>
  );
}
