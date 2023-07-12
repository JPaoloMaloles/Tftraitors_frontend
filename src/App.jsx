import { useEffect, useState } from "react";
import "./App.css";
import { SummonerInfoIndex } from "./SummonerInfoIndex";
import axios from "axios";

function App() {
  const [summonerInfos, setSummonerInfos] = useState([]);

  const handleSetSummonerInfos = () => {
    axios.get(`http://localhost:3000/summoner_infos.json`).then((response) => {
      console.log("handleSetSummonerInfos", response.data);
      setSummonerInfos(response.data);
    });
  };

  useEffect(handleSetSummonerInfos, []);

  return (
    <>
      <h1> App Page </h1>
      <SummonerInfoIndex summonerInfos={summonerInfos} />
    </>
  );
}

export default App;
