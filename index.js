'use strict';
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

///////////////////////////////////////////////////////////////

//! Imports

//! Architecture OOP

class Workout {
	date = new Date();
	id = toString(Date.now()).slice(-10);
	constructor(coords, distance, duration) {
		this.coords = coords;
		this.distance = distance;
		this.duration = duration;
	}

	_descriptionFunction() {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		this.description = `${this.type[0].toUpperCase()} ${this.type.slice(
			1
		)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
	}
}

//! Cycling class

class Cycling extends Workout {
	type = 'running';
	constructor(coords, distance, duration, elevationGain) {
		super(coords, distance, duration);
		this.elevationGain = elevationGain;
		this.calcSpeed();
		this._descriptionFunction();
	}

	calcSpeed() {
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

//! Running class

class Running extends Workout {
	type = 'running';
	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
		this.calcPace;
		this._descriptionFunction();
	}

	//? TO be checked
	calcPace() {
		this.pace = this.distance / this.duration;
		return this.pace;
	}
}

const running1 = new Running();

const cycling1 = new Cycling();
//! Mother App Engine
class App {
	#map;
	#mapEvent;
	#mapZoom = 13;
	#workouts = [];

	//? 1. Get the current position
	constructor() {
		this._getPosition;

		//* get local Storage

		this._getLocalStorage();

		form.addEventListener('submit', this._newWorkOut.bind(this));

		console.log(this_loadMap(this._getPosition()));
	}

	//* 1. Loading the map

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;

		const coords = [latitude, longitude];
		console.log(coords);
		this.#map = L.map('map').setView(coords, this.#mapZoom);
		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		this.#map.on('click', this._showForm.bind(this));

		this.#workouts.forEach((el) => {
			//Render marker to all the workouts
			this._renderWorkoutMarker(el);
		});
	}

	//* 2. Getting the current position

	_getPosition() {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function () {
					alert(`Could not load location`);
				}
			);
	}

	//* 3. Showing the form

	_showForm(ev) {
		this.#mapEvent = ev;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	//* 4. Hiding the form

	_hideForm() {
		form.style.display = 'none';

		form.classList.add('hidden');

		inputCadence.value =
			inputElevation.value =
			inputDuration.value =
			inputDistance.value =
				'';
		setTimeout(() => (form.style.display = 'grid'), 1000);
	}

	//* 5. Toggling input

	_togglingInputField() {
		inputElevation.closest('.form__row').classList.toggle('form__row--hidden');

		inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
	}

	//* 6 Rendering the workout marker

	_renderWorkoutMarker(workout) {
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(
				`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
			)
			.openPopup();
	}

	//* 7 Creating a new workout function

	_newWorkOut(e) {
		e.preventDefault();
		//* 1 check the validity

		const isValid = (...inputs) => inputs.every((el) => Number.isFinite(el));

		const positiveNumber = (...inputs) => inputs.every((el) => el > 0);

		const type = inputType.value;
		const distance = +inputDistance.value;
		const duration = +inputDuration.value;
		const { lat, lng } = this.#mapEvent.latlng;
		let workout;

		//* 1.1 Check if type is running
		if (type === ' running') {
			const cadence = +inputCadence.value;
			if (
				!isValid(distance, duration, cadence) ||
				!positiveNumber(distance, duration, cadence)
			)
				return alert(`Input number to be positive and finite`);

			workout = new Running([lat, lng], distance, duration, cadence);
		}

		//* 1.2 Check if the data is valid for cycling

		if (type === 'cycling') {
			const elevation = +inputElevation.value;

			if (
				!isValid(distance, duration, elevation) ||
				!positive(distance, duration)
			)
				return alert(`Input has to be Positive Number`);

			workout = new Cycling([lat, lng], distance, duration, elevation);
		}

		//*2 Adding object ot array

		this.#workouts.push(workout);

		//*3 Put marker on the area clicked

		this._renderWorkoutMarker(workout);

		//TODO

		this.renderWorkout(workout);

		//*5 To remove the form for a new form to be loaded
		this._hideForm();

		//*6 Set Local Storage

		this._localStorage();
	}

	//*  Using the storage (Local Storage)

	_localStorage() {
		localStorage.setItem('workouts', JSON.stringify(this.#workouts));
	}

	_getLocalStorage() {
		const data = JSON.parse(localStorage.getItem('workouts'));

		if (!data) return;

		this.#workouts = data;
		this.#workouts.forEach((el) => this._renderWorkout(el));
	}

	reset() {
		localStorage.removeItem('workouts');
		location.reload();
	}

	_renderWorkout(el) {
		console.log(el);
	}
}

const app = new App();
