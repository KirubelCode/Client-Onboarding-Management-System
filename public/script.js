function generateLink() {
    var selectedPlatform = document.querySelector('input[name="platform"]:checked');

    if (selectedPlatform) {
        var platformValue = selectedPlatform.value;
        var generatedLink = "";

        if (platformValue === "Google") {
            const clientId = '527812031278-crmp1nf91o3a0i72v8kaeboo8baqrqjg.apps.googleusercontent.com';
            const redirectUri = 'https://clientsystemproject2024.vercel.app/oauth2callback';
            const scope = 'openid profile email phone'; 

            generatedLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        } else if (platformValue === "tiktok") {
            generatedLink = "https://www.tiktok.com/";
        } else if (platformValue === "facebook") {
            generatedLink = "https://www.facebook.com/";
        }

        // Redirect to checkPermissions.html with the generated link as a URL parameter
        window.location.href = `checkPermissions.html?link=${encodeURIComponent(generatedLink)}`;
    } else {
        alert("Please select a platform.");
    }
}






function goBack() {
    window.history.back(); // Previous page
}

function displayLink() {
    const linkContainer = document.getElementById('linkContainer');
    const link = sessionStorage.getItem('selectedLink'); // Retrieve selected link from session storage

    if (link) {
        linkContainer.textContent = link;
    } else {
        linkContainer.textContent = 'No link selected.';
    }
    
}

window.onload = () => {
    displayLink();
    setInterval(() => {
        window.location.reload();
    }, 10000); // Reload the page every 10 seconds
}

function copyLink() {
    const link = sessionStorage.getItem('selectedLink');

    if (link) {
        navigator.clipboard.writeText(link) // Copy to clipoard using the api
            .then(() => {
                alert('Link copied to clipboard: ' + link);
            })
            
    } else {
        alert('No link to copy.');
    }
}



// Function toggles edit mode
function toggleEditMode() {
    var inputs = document.querySelectorAll('.client-details input');
    inputs.forEach(function(input) {
        input.removeAttribute('readonly');
    });
}

// Function to redirect to Client Successful page
function redirectToClientSuccessfulPage() {
    window.location.href = "clientSuccessful.html";
}

// Add event listeners to buttons
document.querySelector('.manage-btn').addEventListener('click', toggleEditMode);
document.querySelector('.accept-btn').addEventListener('click', redirectToClientSuccessfulPage);
