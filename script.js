// Campus map graph with all locations and distances
const campusGraph = {
    "VIMS": {
        "Hostel": 70,
        "Workshop": 50
    },
    "Hostel": {
        "VIMS": 70,
        "Exam center": 50,
        "Library/A Block/B Block": 30
    },
    "Exam center": {
        "Hostel": 50,
        "Canteen": 5,
        "Big Audi": 10,
        "Library/A Block/B Block": 70
    },
    "Canteen": {
        "Exam center": 5,
        "Big Audi": 10,
        "VCP": 5
    },
    "Big Audi": {
        "Exam center": 10,
        "Canteen": 10,
        "Stationery": 20,
        "Admission block": 20
    },
    "Workshop": {
        "VIMS": 50,
        "Parking 2": 40,
        "Library/A Block/B Block": 60
    },
    "Parking 2": {
        "Workshop": 40,
        "Gate 2": 10,
        "Library/A Block/B Block": 70
    },
    "Gate 2": {
        "Parking 2": 10,
        "Library/A Block/B Block": 70,
        "Gate 1": 100
    },
    "Library/A Block/B Block": {
        "Hostel": 30,
        "Workshop": 60,
        "Parking 2": 70,
        "Gate 2": 70,
        "Gate 1": 30,
        "Exam center": 70,
        "Stationery": 60
    },
    "Stationery": {
        "Library/A Block/B Block": 60,
        "Big Audi": 20,
        "Admission block": 5,
        "Gate 1": 5
    },
    "Admission block": {
        "Big Audi": 20,
        "Stationery": 5,
        "VCP": 5,
        "Parking 1": 50
    },
    "VCP": {
        "Canteen": 5,
        "Admission block": 5,
        "Parking 1": 50
    },
    "Gate 1": {
        "Gate 2": 100,
        "Library/A Block/B Block": 30,
        "Stationery": 5,
        "Parking 1": 5
    },
    "Parking 1": {
        "Gate 1": 5,
        "Admission block": 50,
        "VCP": 50
    }
};

// Dijkstra's shortest path algorithm
function dijkstra(start, end, graph) {
    const distances = {};
    const previousNodes = {};
    const unvisited = new Set();

    // Initialize distances
    for (let node in graph) {
        distances[node] = Infinity;
        previousNodes[node] = null;
        unvisited.add(node);
    }
    distances[start] = 0;

    while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let currentNode = null;
        let minDistance = Infinity;

        for (let node of unvisited) {
            if (distances[node] < minDistance) {
                minDistance = distances[node];
                currentNode = node;
            }
        }

        if (currentNode === null || distances[currentNode] === Infinity) {
            break;
        }

        unvisited.delete(currentNode);

        // If we reached the destination, we can stop
        if (currentNode === end) {
            break;
        }

        // Check neighbors
        if (graph[currentNode]) {
            for (let neighbor in graph[currentNode]) {
                const distance = graph[currentNode][neighbor];
                const newDistance = distances[currentNode] + distance;

                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previousNodes[neighbor] = currentNode;
                }
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = end;

    while (current !== null) {
        path.unshift(current);
        current = previousNodes[current];
    }

    // Check if path exists
    if (distances[end] === Infinity) {
        return {
            path: [],
            distance: Infinity,
            found: false
        };
    }

    return {
        path: path,
        distance: distances[end],
        found: true
    };
}

// Get the path segments with distances
function getPathSegments(path) {
    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const distance = campusGraph[from][to];
        segments.push({
            from: from,
            to: to,
            distance: distance
        });
    }
    return segments;
}

// Find shortest path and display results
function findShortestPath() {
    const startLocation = document.getElementById('startLocation').value;
    const endLocation = document.getElementById('endLocation').value;

    // Validation
    if (!startLocation || !endLocation) {
        alert('Please select both start and end locations');
        return;
    }

    if (startLocation === endLocation) {
        alert('Start and end locations must be different');
        return;
    }

    // Calculate shortest path
    const result = dijkstra(startLocation, endLocation, campusGraph);

    const resultsContainer = document.getElementById('resultsContainer');
    const pathInfo = document.getElementById('pathInfo');
    const distanceInfo = document.getElementById('distanceInfo');
    const routeSteps = document.getElementById('routeSteps');

    if (!result.found) {
        pathInfo.innerHTML = '<p class="error-message">No path found between these two locations!</p>';
        distanceInfo.innerHTML = '';
        routeSteps.innerHTML = '';
        resultsContainer.classList.remove('results-hidden');
        return;
    }

    // Display path
    const pathString = result.path.join(' → ');
    pathInfo.innerHTML = `<p><strong>Path:</strong> ${pathString}</p>`;

    // Display total distance
    distanceInfo.innerHTML = `<p><strong>Total Distance:</strong> <span class="distance-highlight">${result.distance}m</span></p>`;

    // Display step-by-step route
    const segments = getPathSegments(result.path);
    let stepsHTML = '<h4>Step-by-Step Directions:</h4><ol>';

    segments.forEach((segment, index) => {
        stepsHTML += `<li>Go from <strong>${segment.from}</strong> to <strong>${segment.to}</strong> - <span class="distance-highlight">${segment.distance}m</span></li>`;
    });

    stepsHTML += '</ol>';
    routeSteps.innerHTML = stepsHTML;

    // Show results
    resultsContainer.classList.remove('results-hidden');
}

// Allow Enter key to find path
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startLocation').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') findShortestPath();
    });
    document.getElementById('endLocation').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') findShortestPath();
    });
});
