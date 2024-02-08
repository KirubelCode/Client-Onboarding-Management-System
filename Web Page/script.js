function generateLink() {
    

    // Get  selected platform (e.g., Instagram, TikTok, Facebook)
    var selectedPlatform = document.querySelector('input[name="platform"]:checked');

    if (selectedPlatform) {
        var platformValue = selectedPlatform.value;
        var generatedLink = ""; // Generate the link based on the selected platform

        
        if (platformValue === "instagram") {
            generatedLink = "https://www.instagram.com/";
        } else if (platformValue === "tiktok") {
            generatedLink = "https://www.tiktok.com/";
        } else if (platformValue === "facebook") {
            generatedLink = "https://www.facebook.com/";
        }

        // Display the generated link in the 'generated-link' div
        var generatedLinkDiv = document.querySelector('.generated-link');
        generatedLinkDiv.textContent = generatedLink;
    } else {
        alert("Please select a platform."); // notify user if no platform is selected
    }
}

function goBack() {
    window.history.back(); // Go back to the previous page
}
