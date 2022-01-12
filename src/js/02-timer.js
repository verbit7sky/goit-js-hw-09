import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  days: document.querySelector('.value[data-days]'),
  hours: document.querySelector('.value[data-hours]'),
  minutes: document.querySelector('.value[data-minutes]'),
  seconds: document.querySelector('.value[data-seconds]'),
};

let currentTime = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    currentTime = selectedDates[0];

    if (currentTime < new Date()) {
      refs.button.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      refs.button.disabled = false;
      Notiflix.Notify.success('Ok');
    }
  },
};

flatpickr(refs.input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

refs.button.addEventListener('click', onButtonClick);

function onButtonClick() {
  const timer = setInterval(() => {
    let dateDifference = currentTime - new Date();

    let time = convertMs(dateDifference);
    refs.days.innerHTML = addLeadingZero(time.days);
    refs.hours.innerHTML = addLeadingZero(time.hours);
    refs.minutes.innerHTML = addLeadingZero(time.minutes);
    refs.seconds.innerHTML = addLeadingZero(time.seconds);
    if (dateDifference < 900) {
      clearInterval(timer);
      Notiflix.Notify.warning('Time is up');
    }
  }, 1000);
}
