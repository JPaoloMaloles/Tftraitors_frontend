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
import { SummonerInfoProfile } from "./SummonerInfoProfile";
import { Routes, Route } from "react-router-dom";

export function Content() {
  const [summonerInfos, setSummonerInfos] = useState([]);
  const [isSummonerInfoVisible, setIsSummonerInfoVisible] = useState(false);
  const [currentSummonerInfo, setCurrentSummonerInfo] = useState({});
  const [isImportInProgress, setIsImportInProgress] = useState(null);

  const handleSetIsImportInProgress = (trueOrFalse) => {
    setIsImportInProgress(trueOrFalse);
  };

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

  const handleImportSummonerInfo = (/*region, summonerName, */ params, successCallback) => {
    // console.log("AAAAAAAAAAAAAAAAAAA", region, summonerName);
    console.log(
      `input handleImportSummonerInfo`,
      `region: ${params.get("region")}`,
      `summonerName: ${params.get("summonerName")}`
    );
    // console.log("CCCCCCCCCCCCCCCCCCC", params.get("summonerName"));

    axios.post(`http://localhost:3000/riot_first.json`, params).then((response) => {
      console.log("handleImportSummonerInfo", response.data);
      // setSummonerInfos([...summonerInfos, response.data]);
      handleSetIsImportInProgress(true);
      console.log("Summoner ID is:", response.data.id, params.get("region"));
      console.log("PUUID is:", response.data.puuid);

      handleImportMatchIds(params.get("region"), response.data.puuid, response.data.id);
      successCallback();
    });
  };

  const handleImportMatchIds = (region, puuid, summonerInfo_id) => {
    var tftRegion = {
      BR1: "americas",
      EUN1: "europe",
      EUW1: "europe",
      JP1: "asia",
      KR: "asia",
      LA1: "americas",
      LA2: "americas",
      NA1: "americas",
      OC1: "sea",
      PH2: "sea",
      RU: "europe",
      SG2: "sea",
      TH2: "sea",
      TR1: "europe",
      TW2: "sea",
      VN2: "sea",
    };
    // console.log("$$$$$$$$$$$$$$$$", tftRegion["BR1"]);
    // if (region === "na1") {
    //   tftRegion = "americas";
    // }
    axios
      .get(`http://localhost:3000/riot_second.json`, {
        params: { tftRegion: tftRegion[region], puuid: puuid, summonerInfo_id },
      })
      .then((response) => {
        console.log("handleImportMatchIds", response.data);
        handleEachRiotMatchId(response.data, puuid);
      })
      .then(() => {
        setTimeout(function () {
          axios.get(`http://localhost:3000/summoner_infos/${summonerInfo_id}.json`).then((response) => {
            console.log("====================SummonerInfoImport====================", response.data);
            setSummonerInfos([...summonerInfos, response.data]);
            handleSetIsImportInProgress(false);
          });
        }, 10000);
      });
  };

  const handleEachRiotMatchId = (params, puuid) => {
    console.log("handleEachRiotMatchId", params);
    params["riot_match_ids"].forEach((riot_match_id) => {
      // console.log("after handleEachRiotMatchId", params["tftRegion"], riot_match_id, params["summonerInfo_id"]);
      handleImportMatches(params["tftRegion"], riot_match_id, params["summonerInfo_id"], puuid);
    });
  };

  const handleImportMatches = (tftRegion, riot_match_id, summonerInfo_id, puuid) => {
    console.log(
      "request handleImportMatches",
      `tft_region: ${tftRegion}`,
      `riot_match_id: ${riot_match_id}`,
      `summonerInfo_id: ${summonerInfo_id}`
    );
    axios
      .post(`http://localhost:3000/riot_third.json`, {
        params: { tftRegion: tftRegion, riot_match_id: riot_match_id, summonerInfo_id: summonerInfo_id },
      })
      .then((response) => {
        console.log("handleImportMatches", response.data);
        handleImportMatchSummonerPerformances(tftRegion, riot_match_id, summonerInfo_id, response.data.id, puuid);
      });
  };

  const handleImportMatchSummonerPerformances = (tftRegion, riot_match_id, summonerInfo_id, match_id, puuid) => {
    // console.log(
    //   "request handleImportMatchSummonerPerformances",
    //   tftRegion,
    //   riot_match_id,
    //   summonerInfo_id,
    //   match_id,
    //   puuid
    // );
    axios
      .post(`http://localhost:3000/riot_fourth.json`, {
        params: {
          tftRegion: tftRegion,
          riot_match_id: riot_match_id,
          summonerInfo_id: summonerInfo_id,
          match_id: match_id,
          puuid: puuid,
        },
      })
      .then((response) => {
        console.log(
          `handleImportMatchSummonerPerformances Participant Data for Match #${riot_match_id}, match_id: ${match_id}, summonerInfo_id:${summonerInfo_id}`,
          response
        );
        // Use update syntax to update the affected Matches and summonerInfos, use the id's to correlate them
        // setTimeout(function () {
        //   console.log("hello3");
        // }, 2000);
        // axios.get(`http://localhost:3000/summoner_infos/${summonerInfo_id}.json`).then((response) => {
        //   console.log("REUPDATING", response.data);
        //   setSummonerInfos(
        //     summonerInfos.map((summonerInfo) => {
        //       if (summonerInfo.id === response.data.id) {
        //         return response.data;
        //       } else {
        //         return summonerInfo;
        //       }
        //     })
        //   );
        // });
      });
    // handleUpdateImport(summonerInfo_id);
  };

  // const handleUpdateImport = (id) => {
  //   console.log("handleUpdateImport", id);
  //   // axios.get(`http://localhost:3000/summoner_infos/${id}.json`).then((response) => {
  //   //   console.log("REUPDATING", response.data);
  //   //   setSummonerInfos(
  //   //     summonerInfos.map((summonerInfo) => {
  //   //       if (summonerInfo.id === response.data.id) {
  //   //         return response.data;
  //   //       } else {
  //   //         return summonerInfo;
  //   //       }
  //   //     })
  //   //   );
  //   // });
  // };

  const handleSummonerProfile = (region, summonerName) => {
    console.log("handleSummonerProfile", region, summonerName);
    axios.get(`http://localhost:3000/profile/${region}/${summonerName}.json`).then((response) => {
      console.log("FINISHED", response.data);
      setCurrentSummonerInfo(response.data);
    });
  };

  useEffect(handleSetSummonerInfos, []);

  return (
    <div className="container">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutLink />} />
        <Route
          path="/manual_create"
          element={<SummonerInfoCreate handleCreateSummonerInfo={handleCreateSummonerInfo} />}
        />
        <Route
          path="/"
          element={
            <div>
              <ImportSummonerInfo
                handleImportSummonerInfo={handleImportSummonerInfo}
                isImportInProgress={isImportInProgress}
              />
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
          }
        />
        <Route
          path="profile/:param_region/:param_summoner_name"
          element={
            <div>
              <SummonerInfoProfile
                summonerInfos={summonerInfos}
                handleSummonerProfile={handleSummonerProfile}
                handleSetIsSummonerInfoVisible={handleSetIsSummonerInfoVisible}
                currentSummonerInfo={currentSummonerInfo}
              />
              <Modal show={isSummonerInfoVisible} onClose={onClose}>
                <SummonerInfoShow
                  currentSummonerInfo={currentSummonerInfo}
                  handleUpdateSummonerInfo={handleUpdateSummonerInfo}
                  handleDestroySummonerInfo={handleDestroySummonerInfo}
                />
              </Modal>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
