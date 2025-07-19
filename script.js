// Global variables for elements
const homePage = document.getElementById('home-page');
const visualizerPage = document.getElementById('visualizer-page');
const homeLink = document.getElementById('home-link');
const algorithmsLink = document.getElementById('algorithms-link');
const exploreAlgorithmsBtn = document.getElementById('explore-algorithms');
const backToHomeBtn = document.getElementById('back-to-home');
const generateArrayBtn = document.getElementById('generate-array');
const algorithmSelect = document.getElementById('algorithm-select');
const startSortBtn = document.getElementById('start-sort');
const speedRange = document.getElementById('speed-range');
const arrayContainer = document.getElementById('array-container');
const explanationText = document.getElementById('explanation-text');
const algorithmCards = document.querySelectorAll('.algorithm-card');
const targetInputContainer = document.getElementById('target-input-container');
const targetValueInput = document.getElementById('target-value');

let currentArray = [];
let animationSpeed = 200; // Default speed in milliseconds
let isVisualizing = false; // Renamed from isSorting to be more general
let stopVisualizationFlag = false; // Flag to stop visualization gracefully

// Algorithm explanations
const algorithmExplanations = {
    bubbleSort: `<b>Bubble Sort:</b> Compares adjacent elements and repeatedly swaps them if they are in wrong order. It's simple but inefficient for large lists.<br><br>
                 <b>Approach:</b> Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted.<br><br>
                 <b>Analogy:</b> Bubbles rising to the surface (largest/smallest elements "bubble" to their correct position).`,
    selectionSort: `<b>Selection Sort:</b> Finds the minimum element from the unsorted part and puts it at the beginning.<br><br>
                    <b>Approach:</b> Divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum (or maximum) element from the unsorted sublist and swaps it with the leftmost unsorted element, moving it to the sorted sublist.<br><br>
                    <b>Analogy:</b> Picking the smallest item from a pile and placing it at the beginning.`,
    insertionSort: `<b>Insertion Sort:</b> Builds the final sorted array (or list) one item at a time. It iterates through the input elements and removes one element at a time, finds the place within the sorted array, and inserts it there.<br><br>
                    <b>Approach:</b> Builds the final sorted array (or list) one item at a time. It iterates through the input elements and removes one element at a time, finds the correct position within the already sorted part, and inserts it there.<br><br>
                    <b>Analogy:</b> Sorting a hand of playing cards by inserting each new card into its correct place among the already sorted cards.`,
    mergeSort: `<b>Merge Sort:</b> A divide and conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.<br><br>
                <b>Approach:</b> A "divide and conquer" algorithm. It recursively divides the unsorted list into n sublists, each containing one element (a list of one element is considered sorted). Then, it repeatedly merges sublists to produce new sorted sublists until there is only one sorted list remaining.<br><br>
                <b>Analogy:</b> Splitting a deck of cards in half repeatedly until individual cards, then merging them back in order.`,
    quickSort: `<b>Quick Sort:</b> Also a divide and conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.<br><br>
                <b>Approach:</b> Also a "divide and conquer" algorithm. It picks an element as a "pivot" and partitions the array around the pivot, placing all elements smaller than the pivot before it, and all greater elements after it. It then recursively applies the same process to the sub-arrays.<br><br>
                <b>Analogy:</b> Picking a central card and arranging other cards to its left (smaller) and right (larger), then repeating for the two new groups.`,
    linearSearch: `<b>Linear Search:</b> Sequentially checks each element of the list until a match is found or the whole list has been searched.<br><br>
                   <b>Approach:</b> Iterates through each element of the list one by one, from the beginning to the end, comparing each element with the target value until a match is found or the entire list has been traversed.<br><br>
                   <b>Analogy:</b> Looking for a specific book on a shelf by checking each book from left to right.`,
    binarySearch: `<b>Binary Search:</b> Finds the position of a target value within a <b>sorted</b> array. It compares the target value to the middle element of the array.<br><br>
                   <b>Approach:</b> A "divide and conquer" algorithm that efficiently finds a target value within a <b>sorted</b> array. It repeatedly divides the search interval in half. It compares the target value to the middle element of the interval. If the target is found, its position is returned. If the target is smaller, the search continues in the lower half; if larger, in the upper half. This process continues until the target is found or the interval becomes empty.<br><br>
                   <b>Analogy:</b> Looking up a word in a dictionary by opening to the middle, then deciding if the word is in the first or second half, and repeating.`
};

// Data Structure Explanations (for informational cards on home page)
const dataStructureExplanations = {
    stack: "<b>Stack (LIFO):</b> A Last-In, First-Out data structure. Elements are added and removed from the 'top'. Operations include Push (add) and Pop (remove).",
    queue: "<b>Queue (FIFO):</b> A First-In, First-Out data structure. Elements are added to the 'rear' and removed from the 'front'. Operations include Enqueue (add) and Dequeue (remove)."
};


// --- Page Navigation Functions ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    if (pageId === 'home-page') {
        homeLink.classList.add('active');
    } else if (pageId === 'visualizer-page') {
        algorithmsLink.classList.add('active');
        // Update explanation and UI elements when navigating to visualizer page
        updateVisualizerUI(algorithmSelect.value);
    }
}

// --- Array Generation and Rendering ---
function generateRandomArray(size = 20) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 90) + 10); // Numbers between 10 and 99
    }
    currentArray = arr;
    renderArray(currentArray);
    targetValueInput.value = ''; // Clear target input on new array generation
}

function renderArray(arr, comparing = [], swapping = [], sorted = [], foundIdx = -1, notFoundIdx = -1) {
    arrayContainer.innerHTML = ''; // Clear previous numbers
    arr.forEach((value, index) => {
        const numberBox = document.createElement('div');
        numberBox.classList.add('number-box');
        numberBox.textContent = value;

        // Add visualization classes based on algorithm state
        if (comparing.includes(index)) {
            numberBox.classList.add('comparing');
        }
        if (swapping.includes(index)) {
            numberBox.classList.add('swapping');
        }
        if (sorted.includes(index)) {
            numberBox.classList.add('sorted');
        }
        if (index === foundIdx) {
            numberBox.classList.add('found');
        }
        if (index === notFoundIdx) {
            numberBox.classList.add('not-found');
        }
        arrayContainer.appendChild(numberBox);
    });
}

// --- Visualization Control ---
function sleep() {
    return new Promise(resolve => setTimeout(resolve, animationSpeed));
}

async function visualizeStep(arr, comparing = [], swapping = [], sorted = [], foundIdx = -1, notFoundIdx = -1) {
    if (stopVisualizationFlag) {
        throw new Error("Visualization stopped by user.");
    }
    renderArray(arr, comparing, swapping, sorted, foundIdx, notFoundIdx);
    await sleep();
}

function disableControls(disable) {
    generateArrayBtn.disabled = disable;
    algorithmSelect.disabled = disable;
    speedRange.disabled = disable;
    exploreAlgorithmsBtn.disabled = disable;
    backToHomeBtn.disabled = disable;
    targetValueInput.disabled = disable; // Disable target input during visualization
    algorithmCards.forEach(card => card.style.pointerEvents = disable ? 'none' : 'auto');
}

// --- Algorithm Explanations & UI Updates ---
function updateVisualizerUI(algorithmName) {
    // Update explanation text
    explanationText.innerHTML = algorithmExplanations[algorithmName] || "Select an algorithm to see its explanation.";

    // Show/hide target input based on algorithm type
    const searchAlgorithms = ['linearSearch', 'binarySearch'];
    if (searchAlgorithms.includes(algorithmName)) {
        targetInputContainer.classList.remove('hidden');
    } else {
        targetInputContainer.classList.add('hidden');
    }
}


// --- Sorting Algorithms ---

// Helper function for swapping elements
async function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    await visualizeStep(arr, [], [i, j]); // Highlight swapping elements
}

// Bubble Sort
async function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await visualizeStep(arr, [j, j + 1]); // Highlight comparing elements
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
            }
        }
        await visualizeStep(arr, [], [], Array.from({ length: i + 1 }, (_, k) => n - 1 - k)); // Mark sorted
    }
    await visualizeStep(arr, [], [], Array.from({ length: n }, (_, k) => k)); // Mark all sorted
}

// Selection Sort
async function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            await visualizeStep(arr, [minIdx, j]); // Highlight comparing
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(arr, i, minIdx);
        }
        await visualizeStep(arr, [], [], Array.from({ length: i + 1 }, (_, k) => k)); // Mark sorted
    }
    await visualizeStep(arr, [], [], Array.from({ length: n }, (_, k) => k)); // Mark all sorted
}

// Insertion Sort
async function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            await visualizeStep(arr, [j, j + 1]); // Highlight comparing
            arr[j + 1] = arr[j];
            await visualizeStep(arr, [], [j, j + 1]); // Highlight shifting
            j = j - 1;
        }
        arr[j + 1] = key;
        await visualizeStep(arr, [], [j + 1], Array.from({ length: i + 1 }, (_, k) => k)); // Mark current position and sorted part
    }
    await visualizeStep(arr, [], [], Array.from({ length: n }, (_, k) => k)); // Mark all sorted
}

// Merge Sort
async function mergeSort(arr, l = 0, r = arr.length - 1) {
    if (l >= r) {
        return;
    }
    const m = Math.floor(l + (r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0;
    let j = 0;
    let k = l;

    while (i < n1 && j < n2) {
        await visualizeStep(arr, [l + i, m + 1 + j]); // Highlight elements being compared
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        await visualizeStep(arr, [], [k]); // Highlight element being placed
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        await visualizeStep(arr, [], [k]);
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        await visualizeStep(arr, [], [k]);
        j++;
        k++;
    }
    await visualizeStep(arr, [], [], Array.from({ length: r - l + 1 }, (_, idx) => l + idx)); // Mark merged section as sorted
}

// Quick Sort
async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
    if (low === 0 && high === arr.length - 1) { // Only mark all sorted after the initial call completes
        await visualizeStep(arr, [], [], Array.from({ length: arr.length }, (_, k) => k));
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
        await visualizeStep(arr, [j, high]); // Highlight current element and pivot
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j);
        }
    }
    await swap(arr, i + 1, high); // Place pivot in correct position
    return (i + 1);
}

// --- Searching Algorithms ---

async function linearSearch(arr, target) {
    const n = arr.length;
    let found = false;
    for (let i = 0; i < n; i++) {
        await visualizeStep(arr, [i]); // Highlight current element being compared
        if (arr[i] === target) {
            await visualizeStep(arr, [], [], [], i); // Mark as found
            found = true;
            break;
        }
    }
    if (!found) {
        // If not found, highlight all elements in a 'not-found' state briefly
        for (let i = 0; i < n; i++) {
            await visualizeStep(arr, [], [], [], -1, i); // Mark all as not found
        }
        await visualizeStep(arr); // Clear highlights
    }
}

async function binarySearch(arr, target) {
    // Binary search requires a sorted array. If not sorted, sort it first.
    let sortedArray = [...arr]; // Create a copy for sorting
    let isCurrentlySorted = true;
    for(let i = 0; i < sortedArray.length - 1; i++) {
        if (sortedArray[i] > sortedArray[i+1]) {
            isCurrentlySorted = false;
            break;
        }
    }

    if (!isCurrentlySorted) {
        // Temporarily sort the array for binary search visualization
        // Using a simple sort for demonstration. For actual visualization, you might call a sorting algorithm here.
        sortedArray.sort((a, b) => a - b);
        currentArray = sortedArray; // Update currentArray to the sorted version
        renderArray(currentArray, [], [], Array.from({ length: currentArray.length }, (_, k) => k)); // Render sorted array
        await sleep(); // Give a moment to see the sorted array
    } else {
        // If already sorted, just render it with sorted highlights
        renderArray(currentArray, [], [], Array.from({ length: currentArray.length }, (_, k) => k));
        await sleep();
    }


    let low = 0;
    let high = sortedArray.length - 1;
    let found = false;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        await visualizeStep(sortedArray, [mid]); // Highlight middle element

        if (sortedArray[mid] === target) {
            await visualizeStep(sortedArray, [], [], [], mid); // Mark as found
            found = true;
            break;
        } else if (sortedArray[mid] < target) {
            // Highlight the left half as 'not-found' (or just clear highlights)
            for (let i = low; i <= mid; i++) {
                await visualizeStep(sortedArray, [], [], [], -1, i);
            }
            low = mid + 1;
        } else {
            // Highlight the right half as 'not-found'
            for (let i = mid; i <= high; i++) {
                await visualizeStep(sortedArray, [], [], [], -1, i);
            }
            high = mid - 1;
        }
    }

    if (!found) {
        // If not found, highlight all elements in a 'not-found' state briefly
        for (let i = 0; i < sortedArray.length; i++) {
            await visualizeStep(sortedArray, [], [], [], -1, i); // Mark all as not found
        }
        await visualizeStep(sortedArray); // Clear highlights
    }
}


// --- Event Listeners ---
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home-page');
    stopVisualizationFlag = true; // Stop any ongoing visualization
    isVisualizing = false;
    disableControls(false); // Enable controls
    generateRandomArray(); // Regenerate array for fresh start
});

algorithmsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('visualizer-page');
    stopVisualizationFlag = true; // Stop any ongoing visualization
    isVisualizing = false;
    disableControls(false); // Enable controls
    generateRandomArray(); // Generate initial array for visualizer
});

exploreAlgorithmsBtn.addEventListener('click', () => {
    showPage('visualizer-page');
    generateRandomArray(); // Generate initial array for visualizer
});

backToHomeBtn.addEventListener('click', () => {
    showPage('home-page');
    stopVisualizationFlag = true; // Stop any ongoing visualization
    isVisualizing = false;
    disableControls(false); // Enable controls
    generateRandomArray(); // Regenerate array for fresh start
});

generateArrayBtn.addEventListener('click', () => {
    if (isVisualizing) {
        stopVisualizationFlag = true; // Request to stop current visualization
    }
    generateRandomArray();
    isVisualizing = false; // Reset visualization state
    disableControls(false); // Ensure controls are enabled
    startSortBtn.textContent = 'Start Visualization'; // Reset button text
});

algorithmSelect.addEventListener('change', (e) => {
    updateVisualizerUI(e.target.value);
    if (isVisualizing) {
        stopVisualizationFlag = true; // Request to stop current visualization
    }
    // Regenerate array to clear any partial visualization
    generateRandomArray();
    isVisualizing = false; // Reset visualization state
    disableControls(false); // Ensure controls are enabled
    startSortBtn.textContent = 'Start Visualization'; // Reset button text
});

startSortBtn.addEventListener('click', async () => {
    if (isVisualizing) {
        // If visualization is active, stop it
        stopVisualizationFlag = true;
        isVisualizing = false;
        startSortBtn.textContent = 'Start Visualization';
        disableControls(false); // Re-enable controls
        generateRandomArray(); // Reset array to original state or new random
    } else {
        // Start visualization
        isVisualizing = true;
        stopVisualizationFlag = false;
        startSortBtn.textContent = 'Stop Visualization';
        disableControls(true); // Disable controls during visualization, except stop button
        startSortBtn.disabled = false; // Keep stop button enabled

        const algorithm = algorithmSelect.value;
        const arrayCopy = [...currentArray]; // Work on a copy to avoid modifying original during visualization

        try {
            switch (algorithm) {
                case 'bubbleSort':
                    await bubbleSort(arrayCopy);
                    break;
                case 'selectionSort':
                    await selectionSort(arrayCopy);
                    break;
                case 'insertionSort':
                    await insertionSort(arrayCopy);
                    break;
                case 'mergeSort':
                    await mergeSort(arrayCopy);
                    break;
                case 'quickSort':
                    await quickSort(arrayCopy);
                    break;
                case 'linearSearch':
                    const linearSearchTarget = parseInt(targetValueInput.value);
                    if (isNaN(linearSearchTarget)) {
                        // Using alert for simplicity here, consider a custom modal for production
                        alert("Please enter a valid number for the target value for Linear Search.");
                        throw new Error("Invalid target value.");
                    }
                    await linearSearch(arrayCopy, linearSearchTarget);
                    break;
                case 'binarySearch':
                    const binarySearchTarget = parseInt(targetValueInput.value);
                    if (isNaN(binarySearchTarget)) {
                        // Using alert for simplicity here, consider a custom modal for production
                        alert("Please enter a valid number for the target value for Binary Search.");
                        throw new Error("Invalid target value.");
                    }
                    await binarySearch(arrayCopy, binarySearchTarget);
                    break;
                default:
                    console.error('Unknown algorithm selected');
            }
            isVisualizing = false;
            startSortBtn.textContent = 'Start Visualization';
            disableControls(false); // Re-enable all controls after visualization completes
        } catch (error) {
            if (error.message === "Visualization stopped by user.") {
                console.log("Visualization stopped by user.");
                // Array will be regenerated by the generateArrayBtn or navigation click
            } else {
                console.error("An error occurred during visualization:", error);
            }
            isVisualizing = false;
            startSortBtn.textContent = 'Start Visualization';
            disableControls(false); // Re-enable controls on error/stop
            generateRandomArray(); // Reset array
        }
    }
});

speedRange.addEventListener('input', (e) => {
    animationSpeed = 1000 - parseInt(e.target.value); // Invert for intuitive speed control (higher value = faster)
});

algorithmCards.forEach(card => {
    card.addEventListener('click', (e) => {
        const algo = card.dataset.algo;
        if (algo) {
            // If it's a data structure card, just show its explanation on the home page
            if (['stack', 'queue'].includes(algo)) {
                // For data structures, we just update the explanation on the home page
                // as they don't have a direct visualization on the visualizer page yet.
                explanationText.innerHTML = dataStructureExplanations[algo];
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // For sorting/searching algorithms, navigate to visualizer
                algorithmSelect.value = algo; // Set the selected algorithm in the dropdown
                showPage('visualizer-page');
                generateRandomArray(); // Generate initial array for visualizer
                updateVisualizerUI(algo); // Update explanation and UI for the selected algorithm
            }
        }
    });
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    generateRandomArray(); // Generate an initial array on page load
    updateVisualizerUI(algorithmSelect.value); // Set initial explanation and UI state
});
