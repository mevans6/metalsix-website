// Basic JavaScript functionality

// document.addEventListener('DOMContentLoaded', () => {
  // const form = document.getElementById('contact-form');
  // form.addEventListener('submit', (e) => {
     // e.preventDefault(); // Prevent form submission
     // alert('Thank you for your message! We will get back to you soon.');
     // form.reset(); // Clear the form fields
   // });
  // });

document.addEventListener('DOMContentLoaded', function() {
  let learnMoreButton = document.getElementById('learn-more-button');
  var emailPopup = document.getElementById('email-popup');
  var popupClose = document.querySelector('.popup-close');

  learnMoreButton.addEventListener('click', function(event) {
    // event.preventDefault();
    console.log('Learn More button clicked'); // Debugging statement
    emailPopup.style.display = 'flex'; // Show the popup
  });

  popupClose.addEventListener('click', function() {
    emailPopup.style.display = 'none'; // Hide the popup
  });

  // Close the popup when clicking outside of the popup content
  window.addEventListener('click', function(event) {
    if (event.target == emailPopup) {
      emailPopup.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  let downloadButton = document.getElementById('download-button');
  var emailPopup = document.getElementById('email-popup');
  var popupClose = document.querySelector('.popup-close');

  downloadButton.addEventListener('click', function(event) {
    // event.preventDefault();
    console.log('Download button clicked'); // Debugging statement
    emailPopup.style.display = 'flex'; // Show the popup
  });

  popupClose.addEventListener('click', function() {
    emailPopup.style.display = 'none'; // Hide the popup
  });

  // Close the popup when clicking outside of the popup content
  window.addEventListener('click', function(event) {
    if (event.target == emailPopup) {
      emailPopup.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var currentAudio = null;

  window.togglePlayPause = function(audioId, button) {
    var audioElement = document.getElementById(audioId);
    var progressBar = document.getElementById('progress-bar-' + audioId.split('-')[1]);
    var currentTimeElement = document.getElementById('current-time-' + audioId.split('-')[1]);
    var durationElement = document.getElementById('duration-' + audioId.split('-')[1]);

    // Ensure metadata is loaded
    if (audioElement.readyState < 2) {
      audioElement.addEventListener('loadedmetadata', function() {
        durationElement.textContent = formatTime(audioElement.duration);
        playPauseAudio(audioElement, button, progressBar, currentTimeElement);
      });
      audioElement.load();
    } else {
      durationElement.textContent = formatTime(audioElement.duration);
      playPauseAudio(audioElement, button, progressBar, currentTimeElement);
    }
  };

  function playPauseAudio(audioElement, button, progressBar, currentTimeElement) {
    // Pause the currently playing audio
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      var currentButton = document.querySelector('.control-button i.fa-pause');
      if (currentButton) {
        currentButton.classList.remove('fa-pause');
        currentButton.classList.add('fa-play');
      }
    }

    // Toggle play/pause for the clicked audio element
    if (audioElement.paused) {
      audioElement.play();
      button.querySelector('i').classList.remove('fa-play');
      button.querySelector('i').classList.add('fa-pause');
      currentAudio = audioElement;
    } else {
      audioElement.pause();
      button.querySelector('i').classList.remove('fa-pause');
      button.querySelector('i').classList.add('fa-play');
      currentAudio = null;
    }

    // Update icon when audio ends
    audioElement.addEventListener('ended', function() {
      button.querySelector('i').classList.remove('fa-pause');
      button.querySelector('i').classList.add('fa-play');
      currentAudio = null;
      progressBar.style.width = '0%';
      currentTimeElement.textContent = '0:00';
    });

    // Update progress bar and current time as the audio plays
    audioElement.addEventListener('timeupdate', function() {
      var progress = (audioElement.currentTime / audioElement.duration) * 100;
      progressBar.style.width = progress + '%';
      currentTimeElement.textContent = formatTime(audioElement.currentTime);
    });
  }

  // Helper function to format time in minutes and seconds
  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  }
});
