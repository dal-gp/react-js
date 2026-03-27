function App() {
  return (
    <div className="card">
      <Avatar />
      <div className="data">
        <Intro />
        {/* <ul>
          <li>HTML+CSS 💪</li>
          <li>Javascript 💪 </li>
          <li>Web design 💪</li>
          <li>Git and Github 👌</li>
          <li>React 👌</li>
          <li>Nodejs 👌</li>
        </ul> */}

        <SkillsList />
      </div>
    </div>
  );
}

function Avatar() {
  return <img src="./img/dal.jpg" alt="portrait of dal" />;
}

function Intro() {
  return (
    <div>
      <p>Dal S G Pun</p>
      <p>
        Full-stack web developer. When not developing or coding, I like to play
        games, strum guitar or just enjoy the Brissy sun at the beach.
      </p>
    </div>
  );
}

function SkillsList() {
  return (
    <ul className="skill-list">
      <Skill skill="HTML+CSS" emoji="💪" color="blue" />
      <Skill skill="JavaScript" emoji="💪" color="yellow" />
      <Skill skill="Web design" emoji="💪" color="red" />
    </ul>
  );
}

function Skill(props) {
  return (
    <li style={{ backgroundColor: props.color }}>
      <span>{props.skill}</span>
      <span> {props.emoji}</span>
    </li>
  );
}

export default App;
