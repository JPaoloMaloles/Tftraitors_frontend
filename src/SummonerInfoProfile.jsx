import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MatchSummonerPerformance } from "./MatchSummonerPerformanceIndex";
export function SummonerInfoProfile(props) {
  const { param_region, param_summoner_name } = useParams();

  useEffect(() => props.handleSummonerProfile(param_region, param_summoner_name), []);

  return (
    <div>
      {/* {console.log("Return has started")}
      <h1 style={{ color: "white" }}> SummonerInfoProfile </h1>
      <p style={{ color: "white" }}> {param_region} </p>
      <p style={{ color: "white" }}> {param_summoner_name} </p>
      <p style={{ color: "white" }}> {props.currentSummonerInfo.id} </p> */}

      {/* <p style={{ color: "white" }}> {props.currentSummonerInfo.id} </p> */}
      <p></p>
      <div>
        <div className="card">
          <div id="top-card" style={{}}>
            <div className="card-body">
              <div className="card-title">
                <div className="row">
                  <div className="col-sm-3">
                    <img
                      src={`https://raw.communitydragon.org/pbe/game/assets/ux/summonericons/profileicon${props.currentSummonerInfo?.profile_icon_id}.png`}
                      style={{ width: "120px" }}
                    />
                  </div>
                  <div className="col-sm-4" style={{ color: "blue", fontSize: "20px" }}>
                    <p></p>
                    {props.currentSummonerInfo.summoner_name}
                    <p></p>
                  </div>
                  <div className="col-sm-5">
                    <div className="card=text" style={{ textAlign: "center" }}>
                      {" "}
                      {props.currentSummonerInfo.region}
                    </div>
                    <div style={{ color: "red", fontSize: "16px", textAlign: "center" }}>
                      {props.currentSummonerInfo.rank} {props.currentSummonerInfo.tier}
                    </div>
                    <div className="card=text" style={{ textAlign: "center" }}>
                      {" "}
                      lp: {props.currentSummonerInfo.league_points}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card=text">
                <div className="row">
                  <div className="col-sm-2">
                    <div>wins: {props.currentSummonerInfo.wins}</div>
                    <div>losses: {props.currentSummonerInfo.losses}</div>
                  </div>
                  <div className="col-sm-5">STAT GRAPHIC</div>
                  <div className="col-sm-5">STAT DATA</div>
                </div>
              </div>
              <button type="input" onClick={() => props.handleSetIsSummonerInfoVisible(props.currentSummonerInfo)}>
                Show More
              </button>
              <p></p>
            </div>

            <div className="container">
              <MatchSummonerPerformance summonerInfo={props.currentSummonerInfo} />
            </div>
            <p></p>
          </div>
        </div>
        <p></p>
      </div>
    </div>
  );
}
