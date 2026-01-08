// getting a reference to a DOM element - gets 1 element
  let header = document.querySelector('header');
  
  // alert("Hello Friend!"); // still a great way to test code
  // console.log ('Our page has ' + myDivs.length + ' divs.')

  // a timer! a listener or event listener
  let headerTimer = setInterval(swapImage, 4000); // 4 seconds
  let count = 0; //starting at 1 because the 1st image is header1.png

  // JQuery way 
  let header3 = $('header');

  function swapImage() {
    header.style.transition = 'opacity 1s'; // smooth fade
    header.style.opacity = 0;
    
    setTimeout(function() {
    count++;
    if (count === 6) count = 1;
    //count ++; // gen-ai way, this always adds 1 to count

     header.setAttribute('style', 
      'background: url(assets/images/header' + count + '.png) no-repeat center/cover; transition: opacity 1s; opacity: 1;');
  }, 1000);
} // swapImage()

  // Loop_function Gallery
  // 1. first grab a ref to all the images in the gallery
  let homeBot = document.querySelectorAll('.homeBot-img')

  // 2. create an array of all possible image paths
  let allImages = [];  // empty collection
  const MAX_IMAGES = 33;

  // 3. loop through the collection of images and add the src to allImages
  for (let i = 1; i <= MAX_IMAGES; i++) {
    allImages.push('assets/images/homeBot' + i + '.png');
  } 

  //  4. create a timer
  setInterval(randomHomeBotSwap, 2000);

  //create the handler/function to execute code when timer is fired
  function randomHomeBotSwap() {
    
    //first select one of the images from collection 0 - 5 (6 values)
    let pick = Math.floor(Math.random() * homeBot.length);

    // get a random image number from 0 - 32 (index values here)
    let randNum = Math.floor(Math.random() * allImages.length);

    let isUsed = false;
    do {
      isUsed = false;
      for(let i = 0; i < homeBot.length; i++) {
        if(allImages[randNum] === homeBot [i].getAttribute('src')) {
          isUsed = true;
          randNum = Math.floor(Math.random() * allImages.length);
          break;
        } // if
      } // for
    } while(isUsed); // do while

  // finally sets the src
  $(homeBot[pick]).animate({ 
      opacity: .007 
    }, 380, function (){
      homeBot[pick].src = allImages[randNum];
      $(homeBot[pick]).animate({
        opacity: 1
      }, 260, 'swing'); 
    }
  );
} // randomImageSwap()

// CHECKLIST
let checklistButtons = document.querySelectorAll('.button');
let rightDiv = document.querySelector(".serviceRight");
let selectionCount = 0;

// disable button once clicked
function addItem(message, idx) {
  checklistButtons[idx].setAttribute('class', 'button disabled'); //css
  checklistButtons[idx].setAttribute('disabled', true); //html

  selectionCount++; // adds 1 to selection count

  // add a new button on the right with those details 
  let newBtn = document.createElement('button');

  // set the newBtn details/attributes
  // title, value, type, class, onclick, innerHTML
  newBtn.setAttribute('title', message);
  newBtn.setAttribute('value', message);
  newBtn.setAttribute('type', 'button');
  newBtn.setAttribute('class', 'button');
  newBtn.setAttribute('onclick', `restoreItem(this.value, ${idx});`);
  newBtn.innerHTML = message;

  //add the newBtn to the DOM (in the rightDiv)
  rightDiv.appendChild(newBtn);
  checklistCompleteCheck(); //calls another function
} //addItem()

function restoreItem(message, idx) {
  // first enable the botton on the left(list)
  checklistButtons[idx].setAttribute('class', 'button')//css
  checklistButtons[idx].removeAttribute('disabled'); //html

  // delete/remove the button from the rightDiv
  let activeButtons = document.querySelectorAll('.serviceRight .button');
  for (let i = 0; i < activeButtons.length; i++) {
    if(activeButtons[i].getAttribute('value') === message) {
      rightDiv.removeChild(activeButtons[i]);
    }
  } // for
  selectionCount--; // takes 1 away from the selectionCount
} //restoreItem()

function reset() {
  //loop through the checklistButtons and reset
  // the class back to 'button'
  checklistButtons.forEach(btn => {
    btn.setAttribute('class', 'button'); //css
    btn.removeAttribute('disabled'); //html
  });
//clear the rightDiv
rightDiv.innerHTML = '';
} // reset()

function checklistCompleteCheck() {
  if (selectionCount === 13) {
    // redirect to another page
    document.location = 'thankyou.html'
  }
} // checklistCompleteCheck ()

// toggleMenu

let menuOpen = false;

function toggleMenu() {
  if(!menuOpen) { // open the menu
    $('nav').animate({
      right: 0
    }, 420, 'swing');
  }
  else { // close the menu
    $('nav').animate({
      right: -120
    }, 360, 'swing');
  }
  menuOpen = !menuOpen; // flips the state
} // toggleMenu()

// LIGHTBOX
function showBox(num){
    //first make lightbox visible
  $('#lightbox').css('visibility', 'visible' );
    //set the image src for the big picture
  $('#lightboxImage').attr('src', 'assets/images/template' + num + '.png');
} //showBox
function hideBox(){
    //hide the lightbox
  $('#lightbox').css('visibility', 'hidden' );
    //hideBox
}
//closeNav 
function closeNav() {
  $('nav').animate({
      right: -120
    }, 640, 'swing');
    menuOpen = false;
} // closeNav()
function showAboutBox(num){
  $('#lightbox').css('visibility', 'visible');
  $('#lightboxImage').attr('src', 'assets/images/aboutImg' + num + '.png');
}
function showhomeBox(num){
  $('#lightbox').css('visibility', 'visible');
  $('#lightboxImage').attr('src', 'assets/images/homeBot' + num + '.png');
}



