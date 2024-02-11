function generateLink() {
    var selectedPlatform = document.querySelector('input[name="platform"]:checked');

    if (selectedPlatform) {
        var platformValue = selectedPlatform.value;
        var generatedLink = "";

        if (platformValue === "instagram") {
            generatedLink = "https://www.instagram.com/";
        } else if (platformValue === "tiktok") {
            generatedLink = "https://www.tiktok.com/";
        } else if (platformValue === "facebook") {
            generatedLink = "https://www.facebook.com/";
        }

        sessionStorage.setItem('selectedLink', generatedLink); // Store selected link in session

        window.location.href = "checkPermissions.html"; // Redirect to checkPermissions.html
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
