// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://project-public-3c79e-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Check login state on page load
window.onload = function() {
    const loginState = localStorage.getItem('loggedIn');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = new Date().getTime();

    // Check if the user is logged in and if the login time is within 1 minute
    if (loginState === 'true' && (currentTime - loginTime < 60000)) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        refreshData(); // Load data after login
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-content').style.display = 'none';
    }
};

function updateCircle(id, value) {
    const circle = document.getElementById(id);
    if (id === 'initial-alert' || id === 'final-alert') {
        circle.innerHTML = value;
        circle.classList.remove('yes', 'no');
        if (value === 'Yes') {
            circle.classList.add('yes');
            document.getElementById('bell-icon').style.display = 'block'; // Show bell icon
            document.getElementById('bell-icon').classList.add('vibrate'); // Start vibrating
        } else {
            circle.classList.add('no');
            document.getElementById('bell-icon').style.display = 'none'; // Hide bell icon
            document.getElementById('bell-icon').classList.remove('vibrate'); // Stop vibrating
        }
    } else {
        circle.innerHTML = value + `<br><span class="unit">${getUnit(id)}</span>`;
    }
    circle.classList.add('updated');
    setTimeout(() => circle.classList.remove('updated'), 500);
}

function getUnit(id) {
    const units = {
        'rainfall': 'mm',
        'water0-1': 'm³',
        'water1-5': 'm³',
        'water5plus': 'm³',
        'accelerometer': 'm/s²',
        'slope': '°'
    };
    return units[id] || '';
}

function refreshData() {
    // Fetch prediction result
    const resultRef = database.ref('result');

    resultRef.limitToLast(1).once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lastResult = Object.values(data)[0];
                const formattedData = lastResult.result;

                // Parse the formatted data
                const dataDict = {};
                formattedData.split(', ').forEach(item => {
                    const [key, value] = item.split(': ');
                    dataDict[key.trim()] = value.trim();
                });

                // Update circles with fetched values
                updateCircle('rainfall', dataDict['Rainfall']);
                updateCircle('water0-1', dataDict['Water Volume (0-1m)']);
                updateCircle('water1-5', dataDict['Water Volume (1-5m)']);
                updateCircle('water5plus', dataDict['Water Volume (>5m)']);
                updateCircle('accelerometer', dataDict['Accelerometer']);
                updateCircle('slope', dataDict['Slope']);

                // Update Initial Land Slide Alert based on accelerometer value
                const accelerometerValue = parseFloat(dataDict['Accelerometer']);
                const initialAlert = accelerometerValue >= 1 ? 'Yes' : 'No';
                updateCircle('initial-alert', initialAlert);

                // Update Final Land Slide Alert based on the value from Firebase
                const finalAlert = dataDict['Landslide Likelihood'] || 'No';
                updateCircle('final-alert', finalAlert);

                // Submit data to Google Form if not already submitted
                submitToGoogleForm(dataDict, initialAlert, finalAlert);
            }
        })
        .catch((error) => {
            console.error("Error fetching prediction result:", error);
        });
}

function submitToGoogleForm(dataDict, initialAlert, finalAlert) {
    const lastSubmitted = JSON.parse(localStorage.getItem('lastSubmitted')) || {};

    // Create a unique key for the parameters
    const uniqueKey = `${dataDict['Rainfall']}-${dataDict['Water Volume (0-1m)']}-${dataDict['Water Volume (1-5m)']}-${dataDict['Water Volume (>5m)']}-${dataDict['Accelerometer']}-${dataDict['Slope']}`;

    // Check if the current parameters have already been submitted
    if (lastSubmitted.key !== uniqueKey) {
        // Prepare the data for submission
        const formData = new FormData();
        formData.append('entry.948082965', dataDict['Rainfall']); // Replace with your actual entry ID
        formData.append('entry.1473004723', dataDict['Water Volume (0-1m)']); // Replace with your actual entry ID
        formData.append('entry.764819333', dataDict['Water Volume (1-5m)']); // Replace with your actual entry ID
        formData.append('entry.1637101488', dataDict['Water Volume (>5m)']); // Replace with your actual entry ID
        formData.append('entry.1524139504', dataDict['Accelerometer']); // Replace with your actual entry ID
        formData.append('entry.1115362831', dataDict['Slope']); // Replace with your actual entry ID
        formData.append('entry.1625659076', initialAlert); // Initial Land Slide Alert
        formData.append('entry.582503928', finalAlert); // Final Land Slide Alert (replace with your actual entry ID)

        // Send the data to the Google Form
        fetch('https://docs.google.com/forms/d/e/1FAIpQLScbzJwgVRcgPVIYSDwA0XYYo6P1ZXBRvJtfnKBOmSMcbVXHrA/formResponse', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(response => {
            console.log('Data submitted successfully:', response);
            // Update last submitted values
            localStorage.setItem('lastSubmitted', JSON.stringify({ key: uniqueKey }));
        })
        .catch(error => {
            console.error('Error submitting data to Google Form:', error);
        });
    }
}

// Initial data load
refreshData();

// Bell icon click event
document.getElementById('bell-icon').addEventListener('click', function() {
    const prediction = document.getElementById('initial-alert').innerHTML;
    if (prediction === 'Yes') {
        const modal = document.getElementById('caution-modal');
        modal.classList.add('show'); // Show the modal
        setTimeout(() => {
            modal.classList.remove('show'); // Hide the modal after a delay
        }, 5000); // Hide after 5 seconds
    }
});

// Add event listeners for the input fields
document.getElementById('username').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        login(); // Call the login function
    }
});

document.getElementById('password').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        login(); // Call the login function
    }
});

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'LP' && password === '12345678') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('bell-icon').style.display = 'block'; // Show bell icon on main page
        localStorage.setItem('loggedIn', 'true'); // Set login state
        localStorage.setItem('loginTime', new Date().getTime()); // Set login time
        refreshData(); // Load data after login
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Exit animation
window.addEventListener('beforeunload', function() {
    document.body.classList.add('fade-out');
});