'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});




btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();

  console.log('Current scroll(X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // //Scrolling the old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });


  //SCrolling new websites

  section1.scrollIntoView({behavior: 'smooth'});


});

/*
///////////////////////////////
//PAGE NAVIGATION

//This works fine but creates copies for each target element this is why we use delegating to the parent element

document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  });
});
*/
//Event delegation - we put the event listener on a common parent of all the targets we are listening for

//We add the event listener to a common parent of all the events we are listening for
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  //Determine what element originated the event (if/else)
  console.log(e.target);

  //Matching strategy - ignore clicks that did not happen on the links

  if(e.target.classList.contains('nav__link')){
    console.log('Link');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});



///Traversing

// const h1 = document.querySelector('h1');

// h1.closest('.header').style.background = 'var(--gradient-secondary)';



//Tabbed component




tabsContainer.addEventListener('click', function(e){

  const clicked = e.target.closest('.operations__tab'); 



  ///Guard clause - if statement that will return early if some condition is matched.
  if (!clicked) return;

   //Remove classes 

   tabs.forEach( t => t.classList.remove('operations__tab--active'));

   tabsContent.forEach(c=> c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');


  //Activate content area

  console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})






///Menu fade animation - all this works because events bubble up from the target

/*
nav.addEventListener('mouseover', function(e){

  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el=> {
      if(el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
});

nav.addEventListener('mouseout', function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el=> {
      if(el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 1;
  }
});


//////////////////DRY method

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el=> {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', function(e){
  handleHover(e, 0.5);
});

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));



///////////////////////////////


////Sticky navigation

//Scroll event is not efficient for older browers and can encounter delays

// const initialCoords = section1.getBoundingClientRect();



// window.addEventListener('scroll', function(){
//   if( window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })
*/
//Sticky navigation using the Intersection Observer API

const stickyHeader = function(entries){
  const [entry] = entries;
  //console.log(entry);

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const header = document.querySelector('.header');

const headerObserver = new IntersectionObserver(stickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
})

headerObserver.observe(header);
//////////////////////////////
//////////////////
////////////////////
//Reveal sections


const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer){
  const [entry] = entries;
  console.log(entry); 
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  //rootMargin: 
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


///////////////
/////////////
///LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');


const loadImg = function (entries, observer){
   const [entry] = entries;

   if(!entry.isIntersecting) return;
   
   //Replacing the src with data-src
   entry.target.src = entry.target.dataset.src;

   //Loading pictures without the user realising they are lazy images -src changing is done behind the scenes

   entry.target.addEventListener('load', function(){
     entry.target.classList.remove('lazy-img');

     //if not user will see the use of lazy-img and will not be able to load full image at once;
   });
   observer.unobserve(entry.target);
}



const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0, 
  rootMargin: '-50px',
})

imgTargets.forEach(img => imgObserver.observe(img));



////////////////
//Slider component
const slider = function(){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

//Function simplified DRY method



////////////////
//FUNCTIONS


const createDots = function (){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  })
};

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

const goToSlide = function(slide){
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

//Once our application starts it immediately goes to slide 0 for this we need to call the function with the argument of 0



//Initialization function

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
};

init();


//Next slide

const nextSlide = function(){
  if(curSlide === maxSlide - 1) {
    //This returns the slide to the begining once it has hit the las slide and the button is pressed once more
    curSlide = 0;
  }else {
  curSlide++;
};
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide -1;
    //This will come back to last slide once the first slide is in view and the btn is pressed;
  }else{
  curSlide--;};
  goToSlide(curSlide);
  activateDot(curSlide);
};


//////
///Buttons
//

btnRight.addEventListener('click', nextSlide);

/*
btnRight.addEventListener('click', function(){
  if(curSlide === maxSlide - 1) {
    curSlide = 0;
  }else {
  curSlide++;
};


  // slides.forEach((s, i)=> (s.getElementsByClassName.transform = `translateX(${100 * (i- curSlide)}%)`)
  // );
    goToSlide(curSlide)
});

*//////////////////////////


//Previous slide

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});


dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})
};

slider();


/*
//SELECTING ELEMENTS

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSelections = document.querySelectorAll('.section');
console.log(allSelections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //HTML collection - live collection

console.log(document.getElementsByClassName('btn'));


//CREATING AND INSERTING ELEMENTS
//.insertAdjacentHTML;

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';

message.innerHTML= 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
//header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

//DELETING elements

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove();
  //message.parentElement.removeChild(message); 
  //Moving up and down in the DOM tree is called DOM traversing
});


//STYLES

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(getComputedStyle(message).backgroundColor);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');


//Attributes

const log = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);

//Does not work with properties that are not standard / expected to be on images

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

//Set attribute - creates new attribute

logo.setAttribute('company', 'Bankist');
*/


//Implementing scrolling




/*
/////////////////////////////////////////////
//Listening for events 

const h1 = document.querySelector('h1');

const alertH1 = function(e){
  alert('addEventListener: Great you are reading this');

  //You can remove event listener inside the function used to create it. it will only display the function once then stop;
  //h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

//Removing an event listener at a set interval of time;

setTimeout(()=> h1.removeEventListener('mouseenter', alertH1), 3000); 


//bubbling

const randomInt = (min, max)=> Math.floor(Math.random() * (max - min + 1) + min);
console.log(randomInt(0, 255));
///////////////////////
*/