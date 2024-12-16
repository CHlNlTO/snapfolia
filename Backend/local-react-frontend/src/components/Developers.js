import React from 'react';
import '../styles/Developers.css';

const getImageUrl = (imageName) => `${process.env.PUBLIC_URL}/assets/img/${imageName}`;

const DeveloperItem = ({ image, firstName, lastName, role }) => (
  <div className="dev-item">
    <div className="dev-circle">
      <img src={getImageUrl(image)} className="img-fluid rounded-circle" alt={`${firstName} ${lastName}`} />
    </div>
    <div className="dev-name">
      <h3 className="color-dgreen m-0 mt-1 dev-fname">{firstName}</h3>
      <h3 className="color-dgreen m-0 dev-fname">{lastName}</h3>
    </div>
    <h3 className="color-dgreen role">{role}</h3>
  </div>
);

const RoleSection = ({ title, developers }) => (
  <div className="role-container">
    <h3 className="color-dgreen fw-bold text-center role-labels">{title}</h3>
    <div className="dev-container d-flex justify-content-center">
      {developers.map((dev, index) => (
        <DeveloperItem key={index} {...dev} />
      ))}
    </div>
  </div>
);

function Developers() {
  const projectManagers = [
    { image: "img-farofaldane.jpg", firstName: "FAROFALDANE", lastName: "NIKKA YSABEL", role: "PROJECT LEADER" },
    { image: "img-deanmaricel.JPG", firstName: "DEAN MARICEL", lastName: "GASPAR", role: "PROJECT MANAGER" },
    { image: "img-sirpaul.png", firstName: "SIR PAUL DOMINIC", lastName: "TRAMBULO", role: "PROJECT COORDINATOR" },
  ];

  const websiteDevelopers = [
    { image: "img-fernando.jpg", firstName: "FERNANDO", lastName: "HANS JUSTIN", role: "FULL STACK ENGINEER" },
    { image: "img-abutal.png", firstName: "ABUTAL", lastName: "CLARK WAYNE", role: "FULL STACK DEVELOPER" },
    { image: "img-galicia.jpeg", firstName: "GALICIA", lastName: "XANDRA YVONNE", role: "BACK-END DEVELOPER" },
    { image: "img-castillo.png", firstName: "CASTILLO", lastName: "ANGELO", role: "BACK-END DEVELOPER" },
    { image: "img-magcawas.jpg", firstName: "MAGCAWAS", lastName: "KURT VINCENT", role: "FRONT-END DEVELOPER" },
  ];

  const aiResearchers = [
    { image: "img-bagtas.jpg", firstName: "BAGTAS", lastName: "CLOUD NEO", role: "AI LEADER" },
    { image: "img-laygo.png", firstName: "LAYGO", lastName: "NICKO", role: "DL ENGINEER" },
    { image: "img-villamor.jpg", firstName: "VILLAMOR", lastName: "FRANCO MIGUEL", role: "DL ENGINEER" },
    { image: "img-mampusti.jpg", firstName: "MAMPUSTI", lastName: "PRINCE DANIEL", role: "RESEARCH ANALYST" },
    { image: "img-gutierrez.jpeg", firstName: "GUTIERREZ", lastName: "BENEDICT", role: "ML ENGINEER" },
    { image: "img-cruz1.png", firstName: "CRUZ", lastName: "JESTER RAY", role: "ML ENGINEER" },
  ];

  const dataSpecialists = [
    { image: "img-lat.jpg", firstName: "LAT", lastName: "JIRO", role: "DATA ARCHITECT" },
    { image: "img-narvaez.jpg", firstName: "NARVAEZ", lastName: "AIVAN CLARRYNZ", role: "DATA ENGINEER" },
    { image: "img-unciano.jpg", firstName: "UNCIANO", lastName: "REYMER", role: "DATA ENGINEER" },
    { image: "img-parducho.jpg", firstName: "PARDUCHO", lastName: "JOHN CARLO", role: "DATA COLLECTOR" },
    { image: "img-mercado.jpg", firstName: "MERCADO", lastName: "JOHN DANIEL", role: "DATA COLLECTOR" },
    { image: "img-tobias.jpg", firstName: "TOBIAS", lastName: "ALREN", role: "DATA COLLECTOR" },
    { image: "img-ongsingco.jpg", firstName: "ONGSINGCO", lastName: "NEIL ANGELO", role: "DATA CLEANER" },
    { image: "img-mabilangan.jpeg", firstName: "MABILANGAN", lastName: "DHAN ELDRIN", role: "DATA CLEANER" },
    { image: "img-buquis.png", firstName: "BUQUIS", lastName: "MARVIN", role: "DATA CLEANER" },
  ];

  const batch2023_2024 = [
    { image: "img-cruz.png", firstName: "CIPRIANO", lastName: "CRUZ JR.", role: "FRONT-END DEVELOPER" },
    { image: "img-redilla.png", firstName: "MARY ROSE", lastName: "REDILLA", role: "PROJECT MANAGER" },
    { image: "img-mendoza.png", firstName: "ARNALDO JR.", lastName: "MENDOZA", role: "MACHINE LEARNING ENGINEER" },
    { image: "img-macaso.png", firstName: "JOSH", lastName: "MACASO", role: "DATA ENGINEER" },
    { image: "img-mendez.png", firstName: "VEN", lastName: "MENDEZ", role: "BACK-END DEVELOPER" },
    { image: "img-magtibay.png", firstName: "JEAN EILEEN", lastName: "MAGTIBAY", role: "FRONT-END DEVELOPER" },
    { image: "img-lobaton.png", firstName: "GIO", lastName: "LOBATON", role: "TECHNICAL WRITER" },
    { image: "img-moster.png", firstName: "GJ", lastName: "MOSTER", role: "DATA MANAGER" },
  ];

 return (
    <section className="d-flex justify-content-center p-3 pt-5 mt-lg-0 mt-5 animate-fade-in">
      <div className="row d-flex justify-content-center border-r bg-lgreen col-10 px-5 py-4" id="about">
        <img src={getImageUrl("developers_logo.png")} className="developer-logo m-2" alt="Developers" style={{height: '3 rem', width: 'auto'}} />
        <hr className="color-green" style={{ height: '2px', opacity: 1 }} />

        <div className="cs2024-2025">
          <h2 className="color-dgreen fw-bold text-center" style={{ fontSize: '30px' }}>Batch 2024-2025</h2>
          
          <RoleSection title="Project Manager" developers={projectManagers} />
          <RoleSection title="Website Developers" developers={websiteDevelopers} />
          <RoleSection title="AI Research and Development" developers={aiResearchers} />
          <RoleSection title="Data Specialists" developers={dataSpecialists} />
        </div>

        <div className="d-flex flex-column align-items-center text-center">
          <h3 className="pt-2 p-1 color-dgreen m-0" style={{ fontSize: '11.2px' }}>BS Computer Science Batch 2025</h3>
          <h3 className="color-dgreen" style={{ fontSize: '11.2px' }}>College of Computing and Information Technology</h3>
        </div>

        <hr className="color-green" style={{ height: '2px', opacity: 1 }} />

        <h2 className="color-dgreen fw-bold text-center">Batch 2023-2024</h2>
        <div className="dev-container d-flex justify-content-center flex-wrap">
          {batch2023_2024.map((dev, index) => (
            <DeveloperItem key={index} {...dev} />
          ))}
        </div>

        <div className="d-flex flex-column align-items-center text-center">
          <h3 className="pt-2 p-1 color-dgreen m-0" style={{ fontSize: '11.2px' }}>BS Computer Science Batch 2024</h3>
          <h3 className="color-dgreen" style={{ fontSize: '11.2px' }}>College of Computing and Information Technology</h3>
        </div>
      </div>
      <div id="snackbar">Text copied to clipboard</div>
    </section>
  );
}

export default Developers;