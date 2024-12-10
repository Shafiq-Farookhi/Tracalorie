class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // Public Methods/API

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render();
    }


    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._render();
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
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
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

class App {
    constructor() {
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this));

        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this));
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
}

const app = new App();