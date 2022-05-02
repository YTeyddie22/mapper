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
	}

	//* 1. Loading the map

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;
		const coords = [latitude, longitude];
		this.#map = L.map('map').setView(coords, this.#mapZoom);
		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);
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

	_renderWorkerMarker(workout) {}
	//*  Using the storage (Local Storage)
}

const app = new App();
