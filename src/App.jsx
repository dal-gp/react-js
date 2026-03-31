const skills = [
  {
    skill: "HTML/CSS",
    level: "advanced",
    colour: "green",
  },
  {
    skill: "JavaScript",
    level: "intermediate",
    colour: "blue",
  },
  {
    skill: "React",
    level: "beginner",
    colour: "red",
  },
];

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
      {skills.map((skill) => (
        <Skill skill={skill} key={skill.skill} />
      ))}
    </ul>
  );
}

function Skill({ skill }) {
  return (
    <li style={{ backgroundColor: skill.colour }}>
      <span>{skill.skill}</span>
      {/* <span>
        {skill.level === "beginner"
          ? "👶"
          : skill.level === "intermediate"
            ? "👍"
            : "💪"}
      </span> */}
      {skill.level === "beginner" && <span>👶</span>}
      {skill.level === "intermediate" && <span>👍</span>}
      {skill.level === "advanced" && <span>💪</span>}
    </li>
  );
}

export default App;
