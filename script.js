const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusLabel = document.getElementById('status');
const mouseLabel = document.getElementById('mouseCoords');
const savedPointsList = document.getElementById('savedPointsList');

// Array to store saved points with click event listeners
let savedPoints = [];

// Function to draw a point on canvas based on entered coordinates
function drawPoint() {
    const x = document.getElementById('xCoord').value;
    const y = document.getElementById('yCoord').value;

    if (x && y) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw point with radius of 5
        ctx.fillStyle = 'red';
        ctx.fill(); // Fill the point with red color
        statusLabel.textContent = `Point drawn at: (${x}, ${y})`; // Update status
    } else {
        statusLabel.textContent = 'Please enter valid coordinates.'; // Error message
    }
}

// Function to save the point and draw it on the canvas
// Function to save the point and draw it on the canvas with a delete button
function savePoint() {
    const x = document.getElementById('xCoord').value;
    const y = document.getElementById('yCoord').value;
    
    if (x && y) {
        const point = { x: parseFloat(x), y: parseFloat(y) };
        savedPoints.push(point); // Add point to the saved points array
        drawSavedPoints(); // Redraw saved points
        updateSavedPointsList(); // Update the saved points list in the UI

        // Create a delete button next to the point
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn danger';
        deleteButton.onclick = function() {
            removePointFromCanvas(point);
        };

        // Create a div to position the delete button near the point
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'delete-btn-container';
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.left = `${x + 10}px`; // Position it near the x-coordinate
        buttonContainer.style.top = `${y + 10}px`; // Position it near the y-coordinate
        buttonContainer.appendChild(deleteButton);

        // Add the delete button to the canvas container
        document.querySelector('.right').appendChild(buttonContainer);

        statusLabel.textContent = `Point at (${x}, ${y}) saved!`; // Confirmation message
    } else {
        statusLabel.textContent = 'Please enter valid coordinates to save.'; // Error message
    }
}

// Function to remove the point and its delete button from the canvas
function removePointFromCanvas(point) {
    // Remove the point from the saved points array
    savedPoints = savedPoints.filter(p => p !== point);
    
    // Redraw the saved points without the removed one
    drawSavedPoints();
    
    // Remove the delete button associated with the point
    const buttonContainers = document.querySelectorAll('.delete-btn-container');
    buttonContainers.forEach(container => {
        if (parseFloat(container.style.left) === point.x + 10 && parseFloat(container.style.top) === point.y + 10) {
            container.remove(); // Remove the delete button container
        }
    });

    // Update the saved points list in the UI
    updateSavedPointsList();
    statusLabel.textContent = 'Point removed from the canvas.'; // Feedback message
}

// Function to update the list of saved points displayed in the UI
function updateSavedPointsList() {
    savedPointsList.innerHTML = ''; // Clear the list first
    savedPoints.forEach((point, index) => {
        const li = document.createElement('li');
        li.textContent = `(${point.x}, ${point.y})`;
        li.setAttribute('data-index', index); // Set the index for each saved point
        li.addEventListener('click', removePoint); // Add click event listener to remove the point
        savedPointsList.appendChild(li);
    });
}

// Function to remove a point when clicked in the saved points list
function removePoint(event) {
    const pointIndex = event.target.getAttribute('data-index');
    savedPoints.splice(pointIndex, 1); // Remove the point from the array
    drawSavedPoints(); // Redraw saved points
    updateSavedPointsList(); // Update the list of saved points
    statusLabel.textContent = 'Point removed from the list.'; // Feedback message
}

// Function to draw all saved points on the canvas
function drawSavedPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
    savedPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Draw each saved point
        ctx.fillStyle = 'red'; // Set the point color
        ctx.fill();
    });
}

// Function to handle mouse click on canvas to get coordinates
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseLabel.textContent = `Mouse clicked at: (${x.toFixed(2)}, ${y.toFixed(2)})`; // Show mouse coordinates
});

// Function to adjust the canvas size dynamically
function adjustCanvasSize() {
    const newWidth = prompt("Enter new canvas width (in pixels):", canvas.width);
    const newHeight = prompt("Enter new canvas height (in pixels):", canvas.height);

    if (newWidth && newHeight) {
        canvas.width = parseInt(newWidth);
        canvas.height = parseInt(newHeight);
        statusLabel.textContent = `Canvas size adjusted to ${newWidth}x${newHeight}.`; // Update the status
    } else {
        statusLabel.textContent = 'Invalid input for canvas size.'; // Error message
    }
}

// Function to clear the canvas (remove all drawn points)
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    savedPoints = []; // Clear the saved points array
    updateSavedPointsList(); // Clear the saved points list in the UI
    statusLabel.textContent = 'Canvas cleared.'; // Feedback message
}
