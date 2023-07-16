import { useEffect, useState } from "react";
import "./App.css";
import { SummonerInfoIndex } from "./SummonerInfoIndex";
import axios from "axios";
import { Modal } from "./Modal";
import { SummonerInfoShow } from "./SummonerInfoShow";
import { SummonerInfoCreate } from "./SummonerInfoCreate";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LogoutLink } from "./LogoutLink";
import { ImportSummonerInfo } from "./ImportSummonerInfo";

export function Content() {
  const [summonerInfos, setSummonerInfos] = useState([]);
  const [isSummonerInfoVisible, setIsSummonerInfoVisible] = useState(false);
  const [currentSummonerInfo, setCurrentSummonerInfo] = useState({});

  const handleSetSummonerInfos = () => {
    axios.get(`http://localhost:3000/summoner_infos.json`).then((response) => {
      console.log("handleSetSummonerInfos", response.data);
      setSummonerInfos(response.data);
    });
  };

  const handleSetIsSummonerInfoVisible = (summonerInfo) => {
    console.log("handleSetIsSummonerInfoVisible");
    setCurrentSummonerInfo(summonerInfo);
    setIsSummonerInfoVisible(true);
  };

  const onClose = () => {
    setIsSummonerInfoVisible(false);
  };

  const handleCreateSummonerInfo = (params, successCallback) => {
    axios.post(`http://localhost:3000/summoner_infos.json`, params).then((response) => {
      console.log("handleCreateSummonerInfo", response.data);
      setSummonerInfos([...summonerInfos, response.data]);
      successCallback();
    });
  };

  const handleUpdateSummonerInfo = (id, params, successCallback) => {
    axios.patch(`http://localhost:3000/summoner_infos/${id}.json`, params).then((response) => {
      setSummonerInfos(
        summonerInfos.map((summonerInfo) => {
          if (summonerInfo.id === response.data.id) {
            return response.data;
          } else {
            return summonerInfo;
          }
        })
      );
      successCallback();
      onClose();
    });
  };

  const handleDestroySummonerInfo = (summonerInfo) => {
    console.log("handleDestroy");
    axios.delete(`http://localhost:3000/summoner_infos/${summonerInfo.id}.json`).then(() => {
      setSummonerInfos(summonerInfos.filter((s) => s.id !== summonerInfo.id));
      onClose();
    });
  };

  const handleImportSummonerInfo = (region, summonerName, params, successCallback) => {
    console.log("AAAAAAAAAAAAAAAAAAA", region, summonerName);
    console.log("BBBBBBBBBBBBBBBBBBB", params.get("region"));
    console.log("CCCCCCCCCCCCCCCCCCC", params.get("summonerName"));

    axios.post(`http://localhost:3000/riot_first.json`, params).then((response) => {
      console.log("handleImportSummonerInfo", response.data);
      setSummonerInfos([...summonerInfos, response.data]);
      console.log("Summoner ID is:", response.data.id, params.get("region"));
      console.log("PUUID is:", response.data.puuid);
      handleImportMatchId(params.get("region"), response.data.puuid, response.data.id);
      successCallback();
    });
  };

  const handleImportMatchId = (region, puuid, summonerInfo_id) => {
    var tftRegion;
    if (region === "na1") {
      tftRegion = "americas";
    }
    axios
      .get(`http://localhost:3000/riot_second.json`, {
        params: { tftRegion: tftRegion, puuid: puuid, summonerInfo_id },
      })
      .then((response) => {
        console.log("handleImportMatchId", response.data);
        handleEachRiotMatchId(response.data);
      });
  };

  const handleEachRiotMatchId = (params) => {
    console.log("handleImportMatches", params);
    params["riot_match_ids"].forEach((riot_match_id) => {
      console.log("iteration", params["tftRegion"], riot_match_id, params["summonerInfo_id"]);
      handleImportMatches(params["tftRegion"], riot_match_id, params["summonerInfo_id"]);
    });
  };

  const handleImportMatches = (tftRegion, riot_match_id, summonerInfo_id) => {
    console.log("handleImportMatchesBEFORE", `@${tftRegion}@`, `@${riot_match_id}@`, `@${summonerInfo_id}@`);
    axios
      .post(`http://localhost:3000/riot_third.json`, {
        params: { tftRegion: tftRegion, riot_match_id: riot_match_id, summonerInfo_id: summonerInfo_id },
      })
      .then((response) => {
        console.log("handleImportMatchesAFTER", response.data);
        handleImportMatchSummonerPerformances(tftRegion, riot_match_id, summonerInfo_id, response.data.id);
      });
  };

  const handleImportMatchSummonerPerformances = (tftRegion, riot_match_id, summonerInfo_id, match_id) => {
    console.log("handleImportMatchSummonerPerformances", tftRegion, riot_match_id, summonerInfo_id, match_id);
    axios
      .post(`http://localhost:3000/riot_fourth.json`, {
        params: {
          tftRegion: tftRegion,
          riot_match_id: riot_match_id,
          summonerInfo_id: summonerInfo_id,
          match_id: match_id,
        },
      })
      .then((response) => {
        console.log(`Parcipant Data for Match #${riot_match_id}, match_id: ${match_id}`, response.data);
        // Use update syntax to update the affected Matches and summonerInfos, use the id's to correlate them
      });
  };

  useEffect(handleSetSummonerInfos, []);

  return (
    <div className="container">
      <Signup />
      <Login />
      <LogoutLink />
      {/* put logoutlink in the headbar, doesnt need card */}
      {/* <CardFunction />  */}
      {/* only used to test card display */}

      <SummonerInfoCreate handleCreateSummonerInfo={handleCreateSummonerInfo} />
      <ImportSummonerInfo handleImportSummonerInfo={handleImportSummonerInfo} />
      <SummonerInfoIndex
        summonerInfos={summonerInfos}
        handleSetIsSummonerInfoVisible={handleSetIsSummonerInfoVisible}
      />
      <Modal show={isSummonerInfoVisible} onClose={onClose}>
        <SummonerInfoShow
          currentSummonerInfo={currentSummonerInfo}
          handleUpdateSummonerInfo={handleUpdateSummonerInfo}
          handleDestroySummonerInfo={handleDestroySummonerInfo}
        />
      </Modal>
    </div>
  );
}
