$(document).ready(function() {

    // $('.step-2').hide();

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                $('.view-img img').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
        }
        $("#upload").change(function() {
            readURL(this);
        });
    
        $('.uploadbtn').on('click', function() {
            $('#upload').trigger('click');
        });

  });


  $('.save').on('click', function() {
    $('.step-2').show();
});


    //Save as PDF
    function myFunction() {
        window.print();
    }



