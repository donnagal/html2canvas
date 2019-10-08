console.clear();

// TODO: Add message for unsupported browsers.
var canvas = document.getElementById('image'),
    input = document.getElementById('file'),
    theImg,
    blendColor = "#F74902",
    contrast = 1.2,
    blur= 0,
    ctx = canvas.getContext('2d'),
    fadeTime = 120,
    currentFilter = 'grayscale(100%)',
    currentBlend = 'multiply';

// Pass image to render function
function loadImage(src){
  var reader = new FileReader();
  reader.onload = function(e){
    render(e.target.result);
  };
  reader.readAsDataURL(src);
}


// Draw image to canvas and apply filters
function render(src){
  var image = new Image();
  
  image.onload = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.fillStyle = blendColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // @TODO find solution for no .filter support in IE or Safari. Consider this approach: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    ctx.filter = currentFilter + ' contrast(' + contrast + ')';
    ctx.filter += currentFilter + ' blur(' + blur + 'px)';
    ctx.globalCompositeOperation = currentBlend;
    ctx.drawImage(image, 0, 0, image.width, image.height);
  };
  
  image.src = src;
}


// Download contents on canvas using filesaver.js
// @Todo investigate bug downloading in Safari
function downloadIt(){
  canvas.toBlob(function(blob) {
    saveAs(blob, "duotone.png");
  }, "image/png");
}


// Go back to first step and reset canvas
function startOver(){
  screenFade();
}


// Fade between stages of the screen
function screenFade(){
  // Go from step 1 to step 2
  if($('.screen1').is(':visible')){
    $('.screen1').fadeOut(fadeTime, function(){
      $('.screen2').fadeIn(fadeTime, function(){
        $('#image').animate({
          marginTop: '0',
          opacity: '1'
        }, 300);
      });
    });
  }
  // Go from step 2 to step 1 and clear the canvas
  else {
    $('.screen2').fadeOut(fadeTime, function(){
      $('.screen1').fadeIn();
      $('#image').css({
        marginTop: '10px',
        opacity: '0'
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
}


// Set up dropzone
var target = document.getElementById('dropZone');
target.addEventListener("dragover", function(e){e.preventDefault();}, true);
target.addEventListener("drop", function(e){
	e.preventDefault(); 
  theImg = e.dataTransfer.files[0];
	loadImage(theImg);
  screenFade();
}, true);


// Set up filepicker button
input.addEventListener("change", function(e) {
  e.preventDefault();
  theImg = e.srcElement.files[0];
  loadImage(theImg);
  screenFade();
}, true);


// Initialize Spectrum color picker
$("#color").spectrum({
  color: blendColor,
  showInput: true,
  preferredFormat: "hex",
  change: function(color) {
    blendColor = color.toHexString();
    ctx.fillstyle = blendColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(theImg){
      loadImage(theImg);
    }
  }
});


// Init Contrast Slider
$('#contrast').val(contrast);
$('#contrastNum').val(contrast);
function contrastChange(inpt, inpt2){
  $(inpt).on('input', function(){
    contrast = $(this).val();
    $(inpt2).val(contrast);
    if(theImg){
      loadImage(theImg);
    }
  });
}
contrastChange('#contrast', '#contrastNum');
contrastChange('#contrastNum', '#contrast');


// Init Blur Slider
$('#blur').val(blur);
$('#blurNum').val(blur);
function blurChange(inpt3, inpt4){
  $(inpt3).on('input', function(){
    blur = $(this).val();
    $(inpt4).val(blur);
    if(theImg){
      loadImage(theImg);
    }
  });
}
blurChange('#blur', '#blurNum');
blurChange('#blurNum', '#blur');

// Init blend mode picker
$('#blendMode').on('input', function(){
  currentBlend = $(this).val();
  if(theImg){
    loadImage(theImg);
  }
});


// Slide open advanced tray
function advancedTray(trig){
  $(trig).fadeOut(200, function(){
    $('#advancedOptions').fadeIn();
  });
}