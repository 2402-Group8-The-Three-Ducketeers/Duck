import duckimage from "./images/duck-dash-page.png"

const HomeBody = () => {
  return (
    <>
      <div className="container">
        <img src={duckimage} alt="Duck Dash" style={{ width: '100%', height: '750px' }} />
        <div className="intro">
          <h1>DUCK DASH</h1>
          <h2>EMBARK ON THE PUDDLE'S CAPTIVATIONG JOURNEY</h2>
          <section className="intro-buttons">
            <button className="button1">Play</button>
            <button className="button2">Info</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomeBody;