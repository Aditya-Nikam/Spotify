function calculateSongProgress(currentTime, duration) {
    if (currentTime < 0 || duration <= 0) {
        console.error("Invalid input. Time and duration must be positive values.");
        return null;
    }
    
    if (currentTime > duration) {
        console.error("Current time cannot be greater than the duration of the song.");
        return null;
    }
    
    var percentPlayed = (currentTime / duration) * 100;
    return percentPlayed;
}

// Example usage
var currentTimeInSeconds = 90; // For example, 1 minute and 30 seconds
var durationInSeconds = 300;   // For example, 5 minutes

var percentPlayed = calculateSongProgress(currentTimeInSeconds, durationInSeconds);
