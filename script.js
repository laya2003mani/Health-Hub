// Global variables
let userData = {
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || '',
    dob: localStorage.getItem('userDob') || '',
    height: parseFloat(localStorage.getItem('userHeight')) || 0,
    weight: parseFloat(localStorage.getItem('userWeight')) || 0,
    targetWeight: parseFloat(localStorage.getItem('userTargetWeight')) || 0,
    goal: localStorage.getItem('userGoal') || '',
    joinDate: localStorage.getItem('userJoinDate') || new Date().getFullYear(),
    gender: localStorage.getItem('userGender') || 'female'
};

// Calorie tracking variables
let totalCalories = 0;
const dailyGoal = 270;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - current userData:", userData); // Debug
    
    // Popup Ad Functionality
    const showPopupAd = () => {
        const popup = document.getElementById('adPopup');
        const closeBtn = document.querySelector('.close-btn');
        
        if (!popup || !closeBtn) return;
        
        if (!sessionStorage.getItem('adShown')) {
            popup.style.display = 'flex';
            sessionStorage.setItem('adShown', 'true');
            
            closeBtn.addEventListener('click', function() {
                popup.style.display = 'none';
            });
            
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    popup.style.display = 'none';
                }
            });
        }
    };
    setTimeout(showPopupAd, 1000);

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            if (email && password) {
                localStorage.setItem('userEmail', email);
                window.location.href = 'profile.html';
            } else {
                alert('Please enter your email and password.');
            }
        });
    }

    if (document.querySelector('.app-container')) {
        loadUserData();
        updateProfileSection();
        initializeCharts();
        setupEventListeners();
        showSection('dashboard');
        initializeWorkoutLists();
    }

    // Profile view/edit functionality
    if (document.getElementById('profile-view')) {
        loadProfileView();
        setupProfileEdit();
    }

    if (document.getElementById('profile-progress')) {
        loadUserData();
        updateProfileStats();
        initializeCharts();
    }
        
    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            localStorage.setItem('userName', fullname);
            localStorage.setItem('userEmail', email);
            window.location.href = 'profile.html';
        });
    }

    // Profile setup navigation
    if (document.querySelector('.form-container')) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.form-slide');
        const progressBar = document.getElementById('progress');

        window.nextSlide = function() {
            if (validateCurrentSlide()) {
                if (currentSlide < slides.length - 1) {
                    slides[currentSlide].classList.remove('active');
                    currentSlide++;
                    slides[currentSlide].classList.add('active');
                    updateProgress();
                }
            }
        };

        window.prevSlide = function() {
            if (currentSlide > 0) {
                slides[currentSlide].classList.remove('active');
                currentSlide--;
                slides[currentSlide].classList.add('active');
                updateProgress();
            }
        };

        function validateCurrentSlide() {
            const currentSlideEl = slides[currentSlide];
            const input = currentSlideEl.querySelector('input, select');
            
            if (input && !input.value) {
                alert(`Please enter your ${input.placeholder || input.id}`);
                return false;
            }
            return true;
        }

        function updateProgress() {
            const progress = ((currentSlide + 1) / slides.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        window.updateWeightScale = function() {
            const targetWeight = document.getElementById('target-weight').value;
            document.getElementById('target-display').textContent = `Target: ${targetWeight}kg`;
        };

        window.completeSetup = function() {
            const dob = document.getElementById('dob').value;
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const goal = document.getElementById('goal').value;
            const targetWeight = parseFloat(document.getElementById('target-weight').value);
        
            if (!dob || !height || !weight || !goal || !targetWeight) {
                alert('Please complete all fields');
                return;
            }
        
            localStorage.setItem('userDob', dob);
            localStorage.setItem('userHeight', height);
            localStorage.setItem('userWeight', weight);
            localStorage.setItem('userGoal', goal);
            localStorage.setItem('userTargetWeight', targetWeight);
            
            userData = {
                ...userData,
                dob,
                height,
                weight,
                goal,
                targetWeight
            };
        
            console.log("Setup complete - saved weights:", {weight, targetWeight}); // Debug
            window.location.href = 'loss.html';
        };
    }
});

// Initialize workout lists
function initializeWorkoutLists() {
    document.querySelectorAll('.workouts-list').forEach(list => {
        list.style.display = 'none';
    });
    
    document.querySelectorAll('.subcategory-header').forEach(header => {
        header.addEventListener('click', function(e) {
            if (!e.target.classList.contains('fa-chevron-down')) {
                toggleWorkouts(this);
            }
        });
    });
    
    document.querySelectorAll('.subcategory-header .fa-chevron-down').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWorkouts(this.parentElement);
        });
    });
}

function showPlanDetails(planType) {
    document.getElementById('main-plans-view').style.display = 'none';
    document.getElementById(`${planType}-details`).style.display = 'block';
}

function backToPlans() {
    document.querySelectorAll('.plan-detail-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('main-plans-view').style.display = 'block';
}

function toggleWorkouts(header) {
    event.stopPropagation();
    
    const workoutsList = header.nextElementSibling;
    const icon = header.querySelector('.fa-chevron-down');
    
    if (workoutsList.style.display === 'none' || !workoutsList.style.display) {
        workoutsList.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        workoutsList.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function addCalories(calories) {
    totalCalories += calories;
    updateCaloriesDisplay();
    
    const button = event.target;
    button.textContent = "✓ Added!";
    button.style.backgroundColor = "#27ae60";
    
    setTimeout(() => {
        button.textContent = "Completed";
        button.style.backgroundColor = "#2ecc71";
    }, 1500);
}

function updateCaloriesDisplay() {
    const caloriesElement = document.getElementById('today-calories');
    const progressElement = document.getElementById('calories-progress');
    
    const dailyGoal = parseInt(caloriesElement.dataset.dailyGoal) || 240;
    
    caloriesElement.textContent = `${totalCalories} / ${dailyGoal} kcal`;
    
    const percentage = Math.min(100, (totalCalories / dailyGoal) * 100);
    progressElement.style.width = `${percentage}%`;
    
    progressElement.style.backgroundColor = totalCalories >= dailyGoal ? "#2ecc71" : "white";
}

function loadUserData() {
    userData = {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || '',
        dob: localStorage.getItem('userDob') || '',
        height: parseFloat(localStorage.getItem('userHeight')) || 0,
        weight: parseFloat(localStorage.getItem('userWeight')) || 0,
        targetWeight: parseFloat(localStorage.getItem('userTargetWeight')) || 0,
        goal: localStorage.getItem('userGoal') || '',
        joinDate: localStorage.getItem('userJoinDate') || new Date().getFullYear(),
        gender: localStorage.getItem('userGender') || 'female'
    };
    
    console.log("Loaded userData:", userData); // Debug
    
    if (document.getElementById('profile-progress')) {
        updateProfileStats();
    }
}

function updateProfileSection() {
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('member-since').textContent = userData.joinDate;
    document.getElementById('user-greeting').textContent = userData.name.split(' ')[0];

    const initials = userData.name.split(' ')
                  .map(name => name[0])
                  .join('')
                  .toUpperCase();
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) profilePic.textContent = initials || 'U';

    updateWeightDisplays();
    calculateAndDisplayBMI();
    
    initializeCharts();
}

function updateWeightDisplays() {
    console.log("Updating weight displays with:", { 
        weight: userData.weight, 
        target: userData.targetWeight 
    }); // Debug
    
    const currentWeightElements = document.querySelectorAll('.stat-item:nth-child(1) p, .stat-card:nth-child(1) p');
    const targetWeightElements = document.querySelectorAll('.stat-item:nth-child(2) p, .stat-card:nth-child(2) p');
    
    currentWeightElements.forEach(el => {
        if (el.textContent.includes('kg') || el.classList.contains('stat-value')) {
            el.textContent = `${userData.weight} kg`;
        }
    });
    
    targetWeightElements.forEach(el => {
        if (el.textContent.includes('kg') || el.classList.contains('stat-value')) {
            el.textContent = `${userData.targetWeight} kg`;
        }
    });

    const weightDiff = (userData.weight - userData.targetWeight).toFixed(1);
    const weightDiffElements = document.querySelectorAll('.stat-card:nth-child(2) span, .trend');
    
    weightDiffElements.forEach(el => {
        if (el.classList.contains('trend') || el.parentElement.textContent.includes('Target')) {
            el.innerHTML = `${Math.abs(weightDiff)} kg <i class="fas fa-arrow-${weightDiff > 0 ? 'up' : 'down'}"></i>`;
            el.className = weightDiff > 0 ? 'trend up' : 'trend down';
        }
    });

    const dailyCalories = calculateDailyCalories();
    document.querySelector('.stat-item:nth-child(3) p').textContent = `${dailyCalories.toLocaleString()} kcal`;
}

function calculateDailyCalories() {
    let bmr;
    const age = new Date().getFullYear() - new Date(userData.dob).getFullYear();
    
    if (userData.gender === 'male') {
        bmr = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * age);
    }
    
    const tdee = bmr * 1.55;
    
    if (userData.goal === 'loss') {
        return Math.round(tdee - 500);
    } else if (userData.goal === 'gain') {
        return Math.round(tdee + 500);
    } else {
        return Math.round(tdee);
    }
}

// ... [rest of the original code remains exactly the same]
// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(sectionId)) {
            item.classList.add('active');
        }
    });

    // Toggle diet log visibility
    const dietLog = document.getElementById('diet-log');
    if (dietLog) {
        dietLog.classList.toggle('active', sectionId === 'diet');
    }
}

function showWorkoutCategories(level) {
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.remove('active');
    });

    const workoutDetails = document.getElementById('workout-details');
    if (!workoutDetails) return;

    const plan = workoutPlans[level];
    let html = `<div class="workout-categories">
                    <div class="back-button" onclick="backToWorkoutPlans()">
                        <i class="fas fa-arrow-left"></i> Back to Plans
                    </div>
                    <h2>${level.charAt(0).toUpperCase() + level.slice(1)} Workout Plan</h2>`;

    for (const [category, exercises] of Object.entries(plan)) {
        html += `<div class="workout-category">
                    <div class="category-header" onclick="toggleCategory('${level}-${category.replace(/\s+/g, '-').toLowerCase()}')">
                        <h3><i class="fas fa-dumbbell"></i> ${category}</h3>
                        <span>▼</span>
                    </div>
                    <div class="category-content" id="${level}-${category.replace(/\s+/g, '-').toLowerCase()}">`;

        exercises.forEach(exercise => {
            html += `<div class="exercise">
                        <div class="exercise-info">
                            <span class="exercise-name">${exercise.name}</span>
                            <span class="exercise-sets">${exercise.sets}x${exercise.reps}</span>
                        </div>
                    </div>`;
        });

        html += `</div></div>`;
    }

    html += `</div>`;
    workoutDetails.innerHTML = html;
    workoutDetails.classList.add('active');
}

function showDietCategories(type) {
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.remove('active');
    });

    const dietDetails = document.getElementById('diet-details');
    if (!dietDetails) return;

    const plan = dietPlans[type];
    let html = `<div class="diet-categories">
                    <div class="back-button" onclick="backToDietPlans()">
                        <i class="fas fa-arrow-left"></i> Back to Plans
                    </div>
                    <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Diet Plan</h2>`;

    for (const [category, items] of Object.entries(plan)) {
        html += `<div class="diet-category">
                    <h3><i class="fas fa-utensils"></i> ${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <ul>`;

        items.forEach(item => {
            html += `<li>${item}</li>`;
        });

        html += `</ul></div>`;
    }

    html += `</div>`;
    dietDetails.innerHTML = html;
    dietDetails.classList.add('active');
}

function backToWorkoutPlans() {
    showSection('workout');
}

function backToDietPlans() {
    showSection('diet');
}

// Diet functions
function addFood() {
    const foodInput = document.getElementById('food-input');
    const foodList = document.getElementById('food-list');

    if (foodInput.value.trim()) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${foodInput.value.trim()}
            <span class="remove-food" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </span>
        `;
        foodList.appendChild(li);
        foodInput.value = '';
    }
}

// Water tracking
function logWater(amount) {
    const waterProgress = document.querySelector('.water-progress-fill');
    const waterText = document.querySelector('.water-progress span');

    if (!waterProgress || !waterText) return;

    const currentText = waterText.textContent;
    const currentAmount = parseInt(currentText.split('/')[0]);
    const totalAmount = parseInt(currentText.split('/')[1].match(/\d+/)[0]);

    let newAmount = currentAmount + amount;
    if (newAmount > totalAmount) newAmount = totalAmount;

    const newPercentage = (newAmount / totalAmount) * 100;
    waterProgress.style.width = `${newPercentage}%`;
    waterText.textContent = `${newAmount}/${totalAmount} L today`;

    // Visual feedback
    const bottles = document.querySelectorAll('.bottle');
    const bottleIndex = amount === 1 ? 0 : amount === 2 ? 1 : 2;
    if (bottles[bottleIndex]) {
        bottles[bottleIndex].style.transform = 'scale(1.1)';
        setTimeout(() => {
            bottles[bottleIndex].style.transform = '';
        }, 300);
    }
}

// Weight logging
function logWeight() {
    const weightInput = document.getElementById('weight-input');
    const dateInput = document.getElementById('weight-date');

    if (weightInput.value && !isNaN(weightInput.value)) {
        const newWeight = parseFloat(weightInput.value);
        
        // Update userData and localStorage
        userData.weight = newWeight;
        localStorage.setItem('userWeight', newWeight);

        // Update all displays
        updateWeightDisplays();
        calculateAndDisplayBMI();

        // Show success message
        const message = `Weight ${newWeight} kg logged successfully for ${dateInput.value || 'today'}`;
        showToast(message);

        // Clear inputs
        weightInput.value = '';
        dateInput.value = '';
    } else {
        showToast('Please enter a valid weight', 'error');
    }
    
}

// Helper functions
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    if (!category) return;

    category.classList.toggle('active');

    const arrow = event.currentTarget.querySelector('span:last-child');
    if (arrow) {
        arrow.textContent = category.classList.contains('active') ? '▲' : '▼';
    }
}

function calculateAndDisplayBMI() {
    if (userData.height <= 0 || userData.weight <= 0) return;

    const heightInMeters = userData.height / 100;
    const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Update BMI display if element exists
    const bmiElement = document.querySelector('.bmi-value');
    if (bmiElement) {
        bmiElement.textContent = bmi;
        
        // Update BMI category
        const categoryElement = document.querySelector('.bmi-category');
        if (categoryElement) {
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal weight';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';
            
            categoryElement.textContent = category;
            categoryElement.className = 'bmi-category ' + category.toLowerCase().replace(' ', '-');
        }
    }
}

// Profile view/edit functions
function loadProfileView() {
    document.getElementById('profile-dob').textContent = userData.dob ? 
        new Date(userData.dob).toLocaleDateString() : 'Not set';
    document.getElementById('profile-height').textContent = userData.height ? 
        `${userData.height} cm` : 'Not set';
    document.getElementById('profile-weight').textContent = userData.weight ? 
        `${userData.weight} kg` : 'Not set';
    document.getElementById('profile-goal').textContent = userData.goal ? 
        userData.goal.charAt(0).toUpperCase() + userData.goal.slice(1) : 'Not set';
    document.getElementById('profile-target').textContent = userData.targetWeight ? 
        `${userData.targetWeight} kg` : 'Not set';
    
    calculateAndDisplayBMI();
}

function setupProfileEdit() {
    const editBtn = document.getElementById('edit-profile-btn');
    if (!editBtn) return;

    editBtn.addEventListener('click', function() {
        window.location.href = 'profile.html?edit=true';
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize charts
function initializeCharts() {
    // Weight Chart
    if (document.getElementById('weightChart')) {
        const weightCtx = document.getElementById('weightChart').getContext('2d');
        new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: generateLast30Days(),
                datasets: [{
                    label: 'Weight (kg)',
                    data: generateWeightData(),
                    borderColor: '#6a3093',
                    backgroundColor: 'rgba(166, 133, 226, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.floor(userData.targetWeight - 5),
                        max: Math.ceil(parseFloat(userData.weight)) + 5
                    }
                }
            }
        });
    }

    // Activity Chart
    if (document.getElementById('activityChart')) {
        const activityCtx = document.getElementById('activityChart').getContext('2d');
        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Steps',
                    data: [8245, 7542, 9321, 6874, 10245, 5432, 12345],
                    backgroundColor: 'rgba(166, 133, 226, 0.7)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function generateLast30Days() {
    const days = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
}

function generateWeightData() {
    const data = [];
    const startWeight = parseFloat(userData.weight);
    const targetWeight = parseFloat(userData.targetWeight);

    for (let i = 0; i <= 30; i++) {
        const progress = i / 30;
        const targetDiff = startWeight - targetWeight;
        const baseWeight = startWeight - (targetDiff * progress);
        const randomVariation = (Math.random() - 0.5) * 0.5;
        data.push(parseFloat((baseWeight + randomVariation).toFixed(1)));
    }

    return data;
}

function generateLast30Days() {
    const days = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
}

function generateWeightData() {
    const data = [];
    const startWeight = parseFloat(userData.weight);
    const targetWeight = parseFloat(userData.targetWeight);

    for (let i = 0; i <= 30; i++) {
        const progress = i / 30;
        const targetDiff = startWeight - targetWeight;
        const baseWeight = startWeight - (targetDiff * progress);
        const randomVariation = (Math.random() - 0.5) * 0.5;
        data.push(parseFloat((baseWeight + randomVariation).toFixed(1)));
    }

    return data;
}

document.getElementById("finishBtn").addEventListener("click", function() {
    window.location.href = "loss.html"; // Ensure this path is correct
});

function toggleWorkoutDetails(level) {
    const detailsDiv = document.getElementById(`${level}-details`);
    detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
    
    // Optional: Scroll to the expanded section
    detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleSubcategory(header) {
    const workoutItems = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    workoutItems.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

// Initialize - Add click handlers to all plan boxes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.plan-box').forEach(box => {
        box.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            toggleWorkoutDetails(level);
        });
    });
    
    // Initialize all subcategories as hidden
    document.querySelectorAll('.workout-subcategories').forEach(el => {
        el.style.display = 'none';
    });
    
    // Filter button functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            console.log(`Filter by: ${this.textContent}`);
        });
    });
});

function showPlanDetails(plan) {
    document.getElementById('main-plans-view').style.display = 'none';
    document.getElementById(plan + '-details').style.display = 'block';
}

function backToPlans() {
    document.querySelectorAll('.plan-detail-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('main-plans-view').style.display = 'block';
}

function toggleWorkouts(element) {
    const subcategory = element.parentElement;
    subcategory.classList.toggle('active');
    
    // Rotate chevron icon
    const icon = element.querySelector('.fa-chevron-down');
    icon.style.transform = subcategory.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

function showDietDetails(dietType) {
    document.getElementById('main-diets-view').style.display = 'none';
    document.getElementById(dietType + '-details').style.display = 'block';
}

function backToDiets() {
    document.querySelectorAll('.diet-detail-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('main-diets-view').style.display = 'block';
}

function toggleMealOptions(header) {
    const mealOptions = header.nextElementSibling;
    const icon = header.querySelector('i.fas');
    
    mealOptions.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

function filterDiets(type) {
    document.querySelectorAll('.diet-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.diet-box').forEach(box => {
        if (type === 'all' || box.getAttribute('data-diet') === type) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}

function showMentalResource(resourceType) {
    document.getElementById('main-mental-view').style.display = 'none';
    document.getElementById(resourceType + '-details').style.display = 'block';
}

function backToMentalWellness() {
    document.querySelectorAll('.mental-detail-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('main-mental-view').style.display = 'block';
}

function toggleResource(header) {
    const resourceContent = header.nextElementSibling;
    const icon = header.querySelector('i.fas');
    
    resourceContent.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

function showMentalDetails(category) {
    document.getElementById('main-mental-view').style.display = 'none';
    document.getElementById(category + '-details').style.display = 'block';
}

function backToMentalMain() {
    document.querySelectorAll('.mental-detail-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('main-mental-view').style.display = 'block';
}

function toggleMentalOptions(header) {
    const options = header.nextElementSibling;
    const icon = header.querySelector('i.fas');
    
    options.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}
function logWeight() {
    const weightInput = document.getElementById('weight-input');
    const dateInput = document.getElementById('weight-date');

    if (weightInput.value && !isNaN(weightInput.value)) {
        const newWeight = parseFloat(weightInput.value);
        
        // Update userData and localStorage
        userData.weight = newWeight;
        localStorage.setItem('userWeight', newWeight);

        // Update all displays
        updateWeightDisplays();
        calculateAndDisplayBMI();

        // Show success message
        const message = `Weight ${newWeight} kg logged successfully for ${dateInput.value || 'today'}`;
        showToast(message);

        // Clear inputs
        weightInput.value = '';
        dateInput.value = '';
    } else {
        showToast('Please enter a valid weight', 'error');
    }
}
window.completeSetup = function() {
    const dob = document.getElementById('dob').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const goal = document.getElementById('goal').value;
    const targetWeight = parseFloat(document.getElementById('target-weight').value);

    // Save to localStorage
    localStorage.setItem('userDob', dob);
    localStorage.setItem('userHeight', height);
    localStorage.setItem('userWeight', weight);
    localStorage.setItem('userGoal', goal);
    localStorage.setItem('userTargetWeight', targetWeight);
    
    window.location.href = 'dashboard.html';
};
function updateProfileStats() {
    // Update the profile stats in loss.html
    const currentWeightDisplay = document.getElementById('current-weight-display');
    const targetWeightDisplay = document.getElementById('target-weight-display');
    const caloriesDisplay = document.getElementById('calories-display');
    
    if (currentWeightDisplay) {
        currentWeightDisplay.textContent = `${userData.weight} kg`;
    }
    
    if (targetWeightDisplay) {
        targetWeightDisplay.textContent = `${userData.targetWeight} kg`;
    }
    
    if (caloriesDisplay) {
        caloriesDisplay.textContent = `${calculateDailyCalories().toLocaleString()} kcal`;
    }
}
// Basic calorie calculation example
function calculateDailyCalories() {
    const weight = parseFloat(localStorage.getItem('userWeight')) || 0;
    const height = parseFloat(localStorage.getItem('userHeight')) || 0;
    const goal = localStorage.getItem('userGoal');
    
    // Simple calculation - replace with your actual formula
    let baseCalories = weight * 20 + height * 5;
    
    if (goal === 'loss') return Math.round(baseCalories * 0.9);
    if (goal === 'gain') return Math.round(baseCalories * 1.1);
    return Math.round(baseCalories);
}
