$(document).ready(function() {


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



    //Save as PDF
    function myFunction() {
        window.print();
    }




    var vm = new Vue({
        el: "#app",
        data: {
          myPosSize: -1
        },
        methods: {
          increaser: function(){
            this.myPosSize += 2;
          },
          decreaser: function(){
            this.myPosSize -= 2;
          }
        }
      });