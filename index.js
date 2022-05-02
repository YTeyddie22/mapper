'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

///////////////////////////////////////////////////////////////
//! Architecture

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

	//* 3. Render the marker object  !TODO

	//* 4 Rendering the WorkOut function Whether Running or Cycling

	//* 5 Pointer on the map

	//* Showing the form

	_showForm(ev) {
		this.#mapEvent = ev;
		form.classList.remove('hidden');
	}

	//* Hiding the form

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

	//*  Using the storage (Local Storage)
}

const app = new App();
