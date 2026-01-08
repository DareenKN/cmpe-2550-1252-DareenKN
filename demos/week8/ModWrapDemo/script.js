const stepSize = 20;
let startWidth = 40;

// Bind events on page load using arrow function
window.onload = () => {
    // Bind button click events
    document.getElementById('growBtn').onclick = () => growImage();
    document.getElementById('resetBtn').onclick = () => resetDemo();
    
    // Initialize display
    updateDisplay(startWidth);
};

function growImage() {
    
    // Modulus Wrapping Demonstration
    // Goal: Cycle through values 40 → 60 → 80 → 100 → 20 → 40 → 60...
    
    // Step 1: Add the step size
    startWidth += stepSize;  // 40+20=60, 60+20=80, 80+20=100, 100+20=120
    
    // Step 2: Use modulus to wrap the value
    // We want values in range 20-119 to wrap back to 20-100
    // Formula breakdown:
    //   - Subtract 20: shifts our range from (20-120) to (0-100)
    //   - Apply % 100: wraps values 0-100 (when we hit 100, it becomes 0)
    //   - Add 20 back: shifts range back to (20-100)
    // Result: 120 becomes (120-20)%100+20 = 100%100+20 = 0+20 = 20 ✓
    let width = ((startWidth - 20) % 100) + 20;
    
    updateDisplay(width);
    updateSequenceHighlight(clickCount);
    
}

function updateDisplay(width) {
    const image = document.getElementById('tuxImage');
    image.style.width = width + 'px';
    
    document.getElementById('clickCount').textContent = clickCount;
    document.getElementById('currentWidth').textContent = width;
    
    // Show the current formula that was just applied (not the next one)
    // We need to show what calculation resulted in the current width
    if (clickCount === 0) {
        document.getElementById('formulaDisplay').innerHTML = 
            `<strong>Initial State:</strong> width = ${width}px<br>
            <small style="color: #4ecdc4;">Click "Grow Image" to see the modulus wrapping in action!</small>`;
    } else {
        // Show the calculation that just happened
        document.getElementById('formulaDisplay').innerHTML = 
            `
            <strong>Step 1:</strong> ((${startWidth } - 20) % 100) + 20<br>
            <strong>Step 2:</strong> (${startWidth - 20} % 100) + 20 = ${(startWidth  - 20)%100} + 20 = ${width}px<br>
            <small style="color: #4ecdc4;">The % 100 ensures values wrap at 100, bringing us back to 0 (which becomes 20)</small>`;
    }
}

function updateSequenceHighlight(step) {
    // Remove all highlights
    document.querySelectorAll('.value-item[data-step]').forEach(item => {
        item.classList.remove('highlight');
    });
    
    // Add highlight to current step (wrapping after step 4)
    const displayStep = step > 4 ? ((step - 1) % 5) + 1 : step;
    const currentStepElement = document.querySelector(`[data-step="${displayStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('highlight');
    }
}

function resetDemo() {
    startWidth = 40;
    updateDisplay(startWidth);
    updateSequenceHighlight(0);
    console.log('Demo reset to starting width: ' + startWidth + 'px');
}
