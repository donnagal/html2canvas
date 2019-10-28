console.clear();

// TODO: Add message for unsupported browsers.
var canvas = document.getElementById('image'),
    input = document.getElementById('file'),
    theImg,
    blendColor = "#F74902",
    contrast = 1.0,
    brightness = 1.0,
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
    // canvas.width = 1920;
    // canvas.height = 1080;

    // canvas.width = 2480;
    // canvas.height = 3508;


    ctx.fillStyle = blendColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // @TODO find solution for no .filter support in IE or Safari. Consider this approach: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    ctx.filter = currentFilter + ' contrast(' + contrast + ')';
    ctx.filter += currentFilter + ' brightness(' + brightness + ')';
    ctx.filter += currentFilter + ' blur(' + blur + 'px)';
    ctx.globalCompositeOperation = currentBlend;

    // get the scale
    var scale = Math.max(canvas.width / image.width, canvas.height / image.height);

    var x = (canvas.width / 2) - (image.width / 2) * scale;
    var y = (canvas.height / 2) - (image.height / 2) * scale;
    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    
    // position image center
    // var x = (canvas.width / 2) - (image.width / 2) * scale;
    // var y = (canvas.height / 2) - (image.height / 2) * scale;
    // ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

    // position image bottom
    // var x = (canvas.width / 2) - (image.width / 2) * scale;
    // var y = (canvas.height) - (image.height) * scale;
    // ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

    // position image top
    // var x = (canvas.width / 2) - (image.width / 2) * scale;
    // ctx.drawImage(image, x, 0, image.width * scale, image.height * scale);

  };
  
  image.src = src;
}





// Download contents on canvas using filesaver.js
// @Todo investigate bug downloading in Safari
function downloadIt(){
  canvas.toBlob(function(blob) {
    saveAs(blob, "image.png");
  }, "image/png");
}


// Go back to first step and reset canvas
function startOver(){
  screenFade();
  $( ".btn-a4" ).removeClass( "disabled" );
  $(".btn-a4").prop('disabled', false);
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
        $( ".btn-a4" ).addClass( "disabled" );
        $(".btn-a4").prop('disabled', true);
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

// Init brightness Slider
$('#brightness').val(brightness);
$('#brightnessNum').val(brightness);
function brightnessChange(inpt, inpt2){
  $(inpt).on('input', function(){
    brightness = $(this).val();
    $(inpt2).val(brightness);
    if(theImg){
      loadImage(theImg);
    }
  });
}
brightnessChange('#brightness', '#brightnessNum');
brightnessChange('#brightnessNum', '#brightness');

// Init Blur Slider
$('#blur').val(blur);
$('#blurNum').val(blur);
function blurChange(inpt, inpt2){
  $(inpt).on('input', function(){
    blur = $(this).val();
    $(inpt2).val(blur);
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




//Active button classes
$('.btn-group').on('click', 'button', function() {
  $(this).switchClass( 'border-white', 'border-iso', 0)
  .siblings().switchClass( 'border-iso', 'border-white', 0)
});



$(".btn-a4").click(function(){
  $("#dropZone").toggleClass("drop-zone_a4") 

  var c = $("#image"), 
        ctx = c[0].getContext('2d');

    var draw = function(){  
    };

    $(function(){
        // set width and height
         ctx.canvas.height = 3508;
         ctx.canvas.width = 2480;
        // draw
        draw();

        // wait 2 seconds, repeate same process
        setTimeout(function(){
            ctx.canvas.height = 3508;
            ctx.canvas.width = 2480;
            draw();
        }, 2000)
    });
});



$(".btn-screen").click(function(){
  location.reload(); 
});



