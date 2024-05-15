import duckimage from "./images/duck-dash-page.png"
import { Link } from "react-router-dom"

const HomeBody = () => {
  return (
    <>
      <div className="container">
        <img src={duckimage} alt="Duck Dash" style={{ width: '100%', height: '750px' }} />
        <div className="intro">
          <h1>DUCK DASH</h1>
          <h2>EMBARK ON THE PUDDLE'S CAPTIVATIONG JOURNEY</h2>
          <section className="intro-buttons">
            <Link to="/login"><button className="button1">Play</button></Link>
            <button className="button2">Info</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomeBody;