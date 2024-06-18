// ------------------ DEVELOPERS ------------------

// Initialization 
const devs = [
    {
      id: "cruz",
      first_name: "CIPRIANO",
      last_name: "CRUZ JR.",
      position: "FRONT-END DEVELOPER",
      gmail: "ciprianocruz01@gmail.com",
      linkedin: "cipriano-cruz-jr",
      github: "cruzjr-cipriano"
    },
    {
      id: "redilla",
      first_name: "MARY ROSE",
      last_name: "REDILLA",
      position: "PROJECT MANAGER",
      gmail: "mrredilla@gmail.com",
      linkedin: "mary-rose-redilla",
      github: "maryredilla"
    },
    { 
      id: "mendoza",
      first_name: "ARNALDO JR.",
      last_name: "MENDOZA", 
      position: "MACHINE LEARNING ENGINEER",
      gmail: "contact.ajmendoza@gmail.com", 
      linkedin: "arnaldojrmendoza",
      github: "ajmdz"
    },
    {
      id: "macaso",
      first_name: "JOSH",
      last_name: "MACASO",
      position: "DATA ENGINEER",
      gmail: "macaso.ardee@gmail.com",
      linkedin: "joshardee-macaso",
      github: "joshardee"
    },
    { 
      id: "mendez",
      first_name: "VEN",
      last_name: "MENDEZ", 
      position: "BACK-END DEVELOPER",
      gmail: "nev.zednem@gmail.com", 
      linkedin: "ven-mendez-a5a347201",
      github: "venmendez"
    },
    {
      id: "magtibay",
      first_name: "JEAN EILEEN",
      last_name: "MAGTIBAY",
      position: "FRONT-END DEVELOPER",
      gmail: "magtibayjean.e@gmail.com",
      linkedin: "jeanmagtibay",
      github: "jeanmagtibay"
    },
    { 
      id: "lobaton",  
      first_name: "GIO",
      last_name: "LOBATON", 
      position: "TECHNICAL WRITER",
      gmail: "giolobaton1024@gmail.com", 
      linkedin: "paul-genre-lobaton-1a7136290",
      github: "gioLobatski"
    },
    { 
      id: "moster",
      first_name: "GJ",
      last_name: "MOSTER", 
      position: "DATA MANAGER",
      gmail: "mostergj@gmail.com", 
      linkedin: "guillan-jude-moster-16410428a",
      github: "gjmoster05"
    },
  ]

// Loop
  function generate_devs() {
    const container = document.getElementById("devs-div");
  
    // Loop through the array of people
    devs.forEach(dev => {
      // Create HTML elements for each person
      const devHTML = `
        <div class="col-lg-3 col-md-6 col-sm-12">
          <div class="d-flex flex-column justify-content-center align-items-center m-3">
              <div class="d-flex flex-row">
                  <!-- Image -->
                  <img src="./static/img/img-${dev.id}.png" class="img-profile rounded-circle border border-3 border-green" alt="${dev.first_name} ${dev.last_name}">
                  <div class="d-flex flex-column justify-content-evenly">
                      <!-- GMAIL -->
                      <button class="btn border border-1 border-green rounded-circle p-0 social-size d-flex align-items-center" onclick="handleCopyEmail('${dev.gmail}')">
                          <img src="./static/img/logo-gmail.png" class="h-100 w-100 p-05" alt="GMail">
                      </button>
  
                      <!-- LINKEDIN -->
                      <button class="btn border border-1 border-green rounded-circle p-0 social-size d-flex align-items-center ms-2" onclick="openLink('https://www.linkedin.com/in/${dev.linkedin}/')">
                          <img src="./static/img/logo-linkedin.png" class="h-100 w-100 p-05" alt="LinkedIn">
                      </button>
  
                      <!-- GITHUB -->
                      <button class="btn border border-1 border-green rounded-circle p-0 social-size d-flex align-items-center" onclick="openLink('https://github.com/${dev.github}/')">
                          <img src="./static/img/logo-github.png" class="h-100 w-100 p-05" alt="GitHub">
                      </button>
                  </div>
              </div>
              <div class="me-4 text-center">
                <h3 class="color-dgreen m-0 mt-1 dev-fname" style="font-weight: 600;">${dev.first_name}</h3>
                <h3 class="color-dgreen m-0 dev-fname" style="font-weight: 600;">${dev.last_name}</h3>
                <h4 class="color-dgreen">${dev.position}</h4>
              </div>
          </div>
        </div>
      `;
  
      // Append the generated HTML to the container
      container.innerHTML += devHTML;
    });
  }

// Snackbar
let showNotification = false;

const handleNotif = () => {
    showNotification = true;

    // Show the notification
    const notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.appendChild(notifComponent());

    // Set a timeout to hide the notification after 1.5 seconds (1500 milliseconds)
    setTimeout(() => {
        showNotification = false;
        // Remove the notification after the timeout
        notificationContainer.removeChild(notificationContainer.firstChild);
    }, 1500);
};

function notifComponent() {
    const div = document.createElement('div');
    div.className = 'notif rounded-4';
    div.innerHTML = '&#x2713; Email Copied';
    return div;
}



    
  
  // Function to handle copying email to clipboard
    const handleCopyEmail = async (email) => {
        handleNotif();

        try {
            // Try using navigator.clipboard.writeText
            await navigator.clipboard.writeText(email);
            console.log('Text copied to clipboard from navigator:', email);
        } catch (clipboardError) {
            console.error('Clipboard write error:', clipboardError);

            // Fallback: Use document.execCommand for broader compatibility
            const textarea = document.createElement('textarea');
            textarea.value = email;

            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand('copy');
                console.log('Fallback: Text copied to clipboard:', email);
            } catch (execCommandError) {
                console.error('Fallback: Clipboard write error:', execCommandError);
                // Fallback mechanism (e.g., prompt the user to copy manually)
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

  
  // Function to open a link in a new tab
  function openLink(url) {
    window.open(url, "_blank");
  }
  
// Calling the function
  generate_devs();