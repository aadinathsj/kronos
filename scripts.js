let fitcoin = 0; // Initialize Fitcoin counter
let totalTasks = 0; // Total tasks
let completedTasks = 0; // Completed tasks

// Handling task input and adding tasks to the list
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const taskInput = document.getElementById('task-input');
    const task = taskInput.value.trim(); // Get and trim the task input value
    if (task) {
        addTaskToList(task); // Add the task to the list if it's not empty
        taskInput.value = ''; // Clear the input field after adding the task
        totalTasks++; // Increment total tasks
        updateProgressBar(); // Update the progress bar
    }
});

// Function to add a task to the task list
function addTaskToList(task) {
    const tasks = document.getElementById('tasks'); // Get the tasks container (ul)
    const li = document.createElement('li'); // Create a new list item (li)

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

    // Append the task content, complete button, and delete button to the list item
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

// Function to parse tasks, extract time-related keywords, and assign tasks to specific times of the day
function assignTasksToTime(tasks) {
    const schedule = {
        morning: [], // Array to hold morning tasks
        afternoon: [], // Array to hold afternoon tasks
        evening: [], // Array to hold evening tasks
        night: [], // Array to hold night tasks
        specificTime: {} // Object to hold tasks with specific times (e.g., "10 AM")
    };

    // Loop through each task to categorize it by time
    tasks.forEach(task => {
        const timeMatches = task.match(/(\d{1,2} (AM|PM))/i); // Match specific times like "10 AM" or "1 PM"
        const morningMatch = /morning/i.test(task); // Check if "morning" is mentioned
        const afternoonMatch = /afternoon/i.test(task); // Check if "afternoon" is mentioned
        const eveningMatch = /evening/i.test(task); // Check if "evening" is mentioned
        const nightMatch = /night/i.test(task); // Check if "night" is mentioned

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

    return schedule; // Return the schedule object containing categorized tasks
}

// Event listener for the "Generate Plan" button
document.getElementById('generate-plan').addEventListener('click', function() {
    // Extract task content from the list, removing the "Complete" and "Delete" button texts
    const tasks = Array.from(document.getElementById('tasks').children).map(li => li.textContent.replace('Delete', '').replace('Complete', '').trim());
    const dailySchedule = assignTasksToTime(tasks); // Assign tasks to their respective times

    const planOutput = document.getElementById('plan-output');
    planOutput.innerHTML = ''; // Clear previous output

    // If there are tasks with specific times, display them
    if (Object.keys(dailySchedule.specificTime).length > 0) {
        planOutput.innerHTML += '<h3>Specific Times:</h3>';
        for (const [time, tasksAtTime] of Object.entries(dailySchedule.specificTime)) {
            planOutput.innerHTML += `<strong>${time}</strong>: ${tasksAtTime.join(', ')}<br>`;
        }
    }

    // Display tasks assigned to the morning
    if (dailySchedule.morning.length > 0) {
        planOutput.innerHTML += '<h3>Morning:</h3>' + dailySchedule.morning.join(', ') + '<br>';
    }

    // Display tasks assigned to the afternoon
    if (dailySchedule.afternoon.length > 0) {
        planOutput.innerHTML += '<h3>Afternoon:</h3>' + dailySchedule.afternoon.join(', ') + '<br>';
    }

    // Display tasks assigned to the evening
    if (dailySchedule.evening.length > 0) {
        planOutput.innerHTML += '<h3>Evening:</h3>' + dailySchedule.evening.join(', ') + '<br>';
    }

    // Display tasks assigned to the night
    if (dailySchedule.night.length > 0) {
        planOutput.innerHTML += '<h3>Night:</h3>' + dailySchedule.night.join(', ') + '<br>';
    }
});

// Event listener for the "Get Stress Management Tip" button
document.getElementById('stress-tips').addEventListener('click', function() {
    const tipOutput = document.getElementById('tip-output');
    // Array of stress management tips
    const tips = [
        'Take a short walk to clear your mind.',
        'Practice deep breathing exercises.',
        'Listen to some calming music.',
        'Take a 5-minute break to stretch.',
        'Drink a glass of water to stay hydrated.'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)]; // Select a random tip
    tipOutput.textContent = randomTip; // Display the selected tip
});
