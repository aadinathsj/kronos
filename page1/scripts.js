let fitcoin = 0; // Initialize Fitcoin counter
let totalTasks = 0; // Total tasks
let completedTasks = 0; // Completed tasks

// Handling task input and adding tasks to the list
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const task = taskInput.value.trim(); // Get and trim the task input value
    const priority = prioritySelect.value; // Get the selected priority

    if (task) {
        addTaskToList(task, priority); // Add the task to the list with priority
        taskInput.value = ''; // Clear the input field after adding the task
        totalTasks++; // Increment total tasks
        updateProgressBar(); // Update the progress bar
    }
});

// Function to add a task to the task list
function addTaskToList(task, priority) {
    const tasks = document.getElementById('tasks'); // Get the tasks container (ul)
    const li = document.createElement('li'); // Create a new list item (li)

    // Create the priority circle element
    const priorityCircle = document.createElement('span');
    priorityCircle.classList.add('priority-circle');
    priorityCircle.classList.add(`priority-${priority}`); // Add class for priority color

    // Create the span element to hold the task content
    const taskContent = document.createElement('span');
    taskContent.textContent = task; // Set the text content of the task
    taskContent.classList.add('task-content'); // Add a class for styling

    // Create the complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete'; // Set button text to "Complete"
    completeBtn.classList.add('complete'); // Add a class for styling
    completeBtn.addEventListener('click', function() {
        tasks.removeChild(li); // Remove the task from the list when completed
        addFitcoin(10); // Add 10 points to Fitcoin
        completedTasks++; // Increment completed tasks
        updateProgressBar(); // Update the progress bar
    });

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete'; // Set button text to "Delete"
    deleteBtn.classList.add('delete'); // Add a class for styling
    deleteBtn.addEventListener('click', function() {
        tasks.removeChild(li); // Remove the task from the list when deleted
        totalTasks--; // Decrement total tasks
        updateProgressBar(); // Update the progress bar
    });

    // Append the priority circle, task content, complete button, and delete button to the list item
    li.appendChild(priorityCircle);
    li.appendChild(taskContent);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    tasks.appendChild(li); // Append the list item to the tasks container
}

// Function to add points to the Fitcoin counter
function addFitcoin(points) {
    fitcoin += points; // Increment the Fitcoin counter by the given points
    document.getElementById('fitcoin-value').textContent = fitcoin; // Update the Fitcoin display
}

// Function to update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const percentage = (completedTasks / totalTasks) * 100;
    progressBar.style.width = percentage + '%';

    // Trigger zoom animation if progress is 100%
    if (percentage === 100) {
        progressBar.classList.add('complete');
    } else {
        progressBar.classList.remove('complete'); // Remove class if not 100%
    }
}

/// Function to parse tasks, extract time-related keywords, and assign tasks to specific times of the day
function assignTasksToTime(tasks) {
    const schedule = {
        morning: [], // Array to hold morning tasks
        afternoon: [], // Array to hold afternoon tasks
        evening: [], // Array to hold evening tasks
        night: [], // Object to hold night tasks
        specificTime: {} // Object to hold tasks with specific times (e.g., "10 AM")
    };

    // Loop through each task to categorize it by time
    tasks.forEach(task => {
        const timeMatches = task.content.match(/(\d{1,2} (AM|PM))/i); // Match specific times like "10 AM" or "1 PM"
        const morningMatch = /morning/i.test(task.content); // Check if "morning" is mentioned
        const afternoonMatch = /afternoon/i.test(task.content); // Check if "afternoon" is mentioned
        const eveningMatch = /evening/i.test(task.content); // Check if "evening" is mentioned
        const nightMatch = /night/i.test(task.content); // Check if "night" is mentioned

        let assigned = false; // Flag to track if a task was assigned to a time

        // If a specific time is mentioned, add the task to that specific time
        if (timeMatches) {
            const time = timeMatches[0]; // Extract the matched time string
            if (!schedule.specificTime[time]) {
                schedule.specificTime[time] = []; // Initialize the array if it doesn't exist
            }
            schedule.specificTime[time].push(task); // Add the task to the specific time slot
            assigned = true;
        }

        // Assign task to morning if "morning" is mentioned
        if (morningMatch) {
            schedule.morning.push(task);
            assigned = true;
        }

        // Assign task to afternoon if "afternoon" is mentioned
        if (afternoonMatch) {
            schedule.afternoon.push(task);
            assigned = true;
        }

        // Assign task to evening if "evening" is mentioned
        if (eveningMatch) {
            schedule.evening.push(task);
            assigned = true;
        }

        // Assign task to night if "night" is mentioned
        if (nightMatch) {
            schedule.night.push(task);
            assigned = true;
        }

        // Default: If no specific time or period is mentioned, assign to morning
        if (!assigned) {
            schedule.morning.push(task); // Default to morning
        }
    });

    // Function to sort tasks based on priority
    function sortTasksByPriority(tasks) {
        return tasks.sort((a, b) => {
            const priorityLevels = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityLevels[b.priority] - priorityLevels[a.priority];
        });
    }

    // Sort tasks by priority
    for (const key in schedule) {
        if (Array.isArray(schedule[key])) {
            schedule[key] = sortTasksByPriority(schedule[key]);
        } else if (typeof schedule[key] === 'object') {
            for (const time in schedule[key]) {
                schedule[key][time] = sortTasksByPriority(schedule[key][time]);
            }
        }
    }

    return schedule; // Return the schedule object containing categorized tasks
}

/* Function to generate the daily plan and display tasks in styled boxes
document.getElementById('generate-plan').addEventListener('click', function() {
    const tasks = Array.from(document.getElementById('tasks').children).map(li => {
        const taskContent = li.querySelector('.task-content').textContent;
        const priority = li.querySelector('.priority-circle').classList[1].replace('priority-', '');
        return { content: taskContent, priority: priority };
    });   */

    // Function to generate the daily plan and display tasks in styled boxes
document.getElementById('generate-plan').addEventListener('click', function() {
    const tasks = Array.from(document.getElementById('tasks').children).map(li => {
        const taskContent = li.querySelector('.task-content').textContent;
        const priority = li.querySelector('.priority-circle').classList[1].replace('priority-', '');
        // Assuming you have a method to find the time keyword and default assignment
        const timeKeyword = extractTimeKeyword(taskContent); // This function needs to be defined
        const defaultAssignment = 'Morning'; // Change as per logic

        return { content: taskContent, priority: priority, timeKeyword: timeKeyword, defaultAssignment: defaultAssignment };
    });


    const dailySchedule = assignTasksToTime(tasks); // Assign tasks to their respective times

    const planOutput = document.getElementById('plan-output');
    planOutput.innerHTML = ''; // Clear previous output

    // Helper function to create task boxes
    function createTaskBox(task) {
        const box = document.createElement('div');
        box.className = 'task-box'; // Add task-box class for styling

        const priorityCircle = document.createElement('span');
        priorityCircle.className = `priority-circle priority-${task.priority}`; // Set priority circle color

        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = task.content; // Set task content

        box.appendChild(priorityCircle); // Append priority circle to box
        box.appendChild(taskContent); // Append task content to box

        return box; // Return the styled task box element
    }

    // Function to display tasks for a specific time period
    function displayTasks(timePeriod, tasks) {
        if (tasks.length > 0) {
            const heading = document.createElement('h3');
            heading.textContent = timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1) + ':'; // Capitalize time period
            planOutput.appendChild(heading);

            const taskContainer = document.createElement('div');
            taskContainer.className = 'task-container';

            tasks.forEach(task => {
                const taskBox = createTaskBox(task); // Create styled task box
                taskContainer.appendChild(taskBox); // Append task box to container
            });

            planOutput.appendChild(taskContainer); // Append the container to the output
        }
    }

    // Display tasks with specific times
    if (Object.keys(dailySchedule.specificTime).length > 0) {
        planOutput.innerHTML += '<h3>Specific Times:</h3>';
        for (const [time, tasksAtTime] of Object.entries(dailySchedule.specificTime)) {
            tasksAtTime.forEach(task => {
                const taskBox = createTaskBox(task); // Use the actual task object with priority
                planOutput.appendChild(taskBox);
            });
        }
    }

    // Display tasks assigned to each time period
    displayTasks('morning', dailySchedule.morning);
    displayTasks('afternoon', dailySchedule.afternoon);
    displayTasks('evening', dailySchedule.evening);
    displayTasks('night', dailySchedule.night);

    fetch('/write-tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tasks: tasks })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});
// Function to extract time keyword (define this according to your logic)
function extractTimeKeyword(taskContent) {
    const timeMatches = taskContent.match(/(\d{1,2} (AM|PM))/i);
    if (timeMatches) {
        return timeMatches[0];
    }
    return null;
}

// Array of stress management tips
const stressTips = [
    "Practice deep breathing exercises for a few minutes each day.",
    "Take a walk outside to clear your mind and get some fresh air.",
    "Try mindfulness or meditation to stay present and reduce anxiety.",
    "Make time for hobbies and activities you enjoy.",
    "Stay connected with friends and family for emotional support.",
    "Set aside time for regular physical exercise.",
    "Keep a journal to express and reflect on your thoughts and feelings.",
    "Get enough sleep and maintain a healthy sleep routine.",
    "Break tasks into smaller, manageable steps to avoid feeling overwhelmed.",
    "Practice gratitude by noting things you're thankful for each day."
];

// Function to get a random tip
function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * stressTips.length);
    return stressTips[randomIndex];
}

// Event listener for the "Get Stress Management Tip" button
document.getElementById('stress-tips').addEventListener('click', function() {
    const tipOutput = document.getElementById('tip-output');
    tipOutput.textContent = getRandomTip(); // Display a random tip
});

 //WEATHER WIDGET 


document.getElementById('get-weather').addEventListener('click', getWeather);

function getWeather() {
    const apiKey = 'a1be2c9411cabfeb325669ee6a04026c'; // Replace with your API key
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = 'City not found. Please try again.';
        return;
    }

    const temperature = (data.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
    const weatherDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    weatherIcon.src = iconUrl;
    weatherIcon.alt = weatherDescription;

    const weatherDetails = `
        <h3>${data.name}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weatherDescription}</p>
    `;

    weatherInfoDiv.innerHTML = weatherDetails;
    tempDivInfo.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}">`;
}

function displayHourlyForecast(forecast) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';

    for (let i = 0; i < 8; i++) { // Show forecast for the next 8 hours
        const forecastItem = forecast[i];
        const time = new Date(forecastItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temperature = (forecastItem.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
        const weatherDescription = forecastItem.weather[0].description;
        const iconCode = forecastItem.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast-item';

        forecastDiv.innerHTML = `
            <p>${time}</p>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${temperature}°C</p>
            <p>${weatherDescription}</p>
        `;

        hourlyForecastDiv.appendChild(forecastDiv);
    }
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}


