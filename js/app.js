class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        this._displayCaloriesProgressReverse();

        document.getElementById('limit').value = this._calorieLimit;
    }

    // Public Methods/API

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }


    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveworkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }


    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            Storage.removeMeal(id);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();

    }

    loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout));
    }

    // private Methods/API

    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const CaloriesLimitEl = document.getElementById('calories-limit');
        CaloriesLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed(){
        const caloriesConsumedEL = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumedEL.innerHTML = consumed;
    }

    _displayCaloriesBurned(){
        const caloriesBurnedEL = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurnedEL.innerHTML = burned;
    }

    _displayCaloriesRemaining(){
        const caloriesRemainingEL = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEL.innerHTML = remaining;
        const progressEl = document.getElementById('calorie-progress');

        if(remaining <= 0) {
            caloriesRemainingEL.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEL.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }else {
            caloriesRemainingEL.parentElement.parentElement.classList.add('bg-light');
            caloriesRemainingEL.parentElement.parentElement.classList.remove('bg-danger');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');

        }

    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
    
        // Calculate the total meal calories
        const totalMealCalories = this._meals.reduce((total, meal) => total + meal.calories, 0);
    
        // Calculate percentage based on meal calories relative to the limit
        const percentage = ((totalMealCalories / this._calorieLimit) * 100);
    
        // Clamp the width to stay between 0% and 100%
        const width = Math.min(100, Math.max(0, percentage));
    
        // Update the progress bar width
        progressEl.style.width = `${width}%`;
    }
    
    _displayCaloriesProgressReverse() {
        const progressEl = document.getElementById('calorie-progress-reverse');
    
        // Calculate the total meal calories
        const totalWorkoutCalories = this._workouts.reduce((total, workout) => total + workout.calories, 0);
    
        // Calculate percentage based on workout calories relative to the limit
        const percentage = ((totalWorkoutCalories / this._calorieLimit) * 100);
    
        // Clamp the width to stay between 0% and 100%
        const width = Math.min(100, Math.max(0, percentage));
    
        // Update the progress bar width
        progressEl.style.width = `${width}%`;
    }
    

    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

        `;
        mealsEl.appendChild(mealEl);
    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

        `;
        workoutsEl.appendChild(workoutEl);
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        this._displayCaloriesProgressReverse();
    }

}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories
    }
}


class Storage{
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0){
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals(){
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal){
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal,index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals))
    }

    static getWorkouts(){
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveworkout(workout){
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout,index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts))
    }

    static clearAll() {
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');

        // this is for clearing all the data 
        // localStorage.clear();
    }

}


class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._loadEventListeners();
        this._tracker.loadItems(); 
    }

    _loadEventListeners(){
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));

        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newMeal(e) {
        e.preventDefault();

        const name = document.getElementById('meal-name');
        const calorie = document.getElementById('meal-calories');

        // Validate inputs
        if(name.value === '' || calorie.value === ''){
            alert('Please fill in all fields');
            return;
        }
        const meal = new Meal(name.value, +calorie.value);
        this._tracker.addMeal(meal);

        name.value = '';
        name.calorie = '';

        const collapseMeal = document.getElementById('collapse-meal');
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });

    }


    _newWorkout(e) {
        e.preventDefault();

        const name = document.getElementById('workout-name');
        const calorie = document.getElementById('workout-calories');

        // Validate inputs
        if(name.value === '' || calorie.value === ''){
            alert('Please fill in all fields');
            return;
        }
        const workout = new Workout(name.value, +calorie.value);
        this._tracker.addWorkout(workout);

        name.value = '';
        name.calorie = '';

        const collapseworkout = document.getElementById('collapse-workout');
        const bsCollapse = new bootstrap.Collapse(collapseworkout, {
            toggle: true
        });

    }

    _removeItem(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
              
                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    _setLimit(e){
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit!')
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();