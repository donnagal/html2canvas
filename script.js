// see http://www.mattkandler.com/blog/duotone-image-filter-javascript-rails
console.clear();

MediumFramework.View.extend({
  
  name: 'duotone',
  
  el: {
    selector: 'body',
    
    on: {
      'click.reset': {
        delegate: '.reset',
        fn: 'on:reset'
      },
      
      'click.download': {
        delegate: '.download',
        fn: 'on:download'
      }
    },
    
    bind: {
      '$color:a': '.color-a',
      '$color:b': '.color-b',
      '$color:mid': '.color-mid'
    }
  },
  
  props: {
    gradient: {
      defaults: {
        a: "#ff4930",
        b: "#ffa494",
        c: "#ffa494",
        mid: 0.5
      }
    }
  },
  
  fn: {
    init: function () {
      this.bind();
      this.props.$img = $('img');
      this.props.$img.on('load', this.fn.on.ready);
      $('input[type="file"]').on('change', this.fn.on.upload);
      $('.color').on('input', this.fn.on.colour.set);
      
      var $img = this.props.$img.eq(0);
      
      this.props.ctx = $('#duotone').eq(0).getContext('2d');
      this.props.gradient.ctx = $('#gradient').eq(0).getContext('2d');
      
      
      this.$el.on("dragenter", this.fn.on.drag.enter);
      this.$el.on("dragleave", this.fn.on.drag.leave);
      this.$el.on("dragover", this.fn.on.drag.over);
      this.$el.on("drop", this.fn.on.drag.drop);
      
      this.fn.on.colour.reset();
    },
    
    on: {
      
      drag: {
        over: function (e) {
          e.preventDefault();
        },
        
        enter: function (e) {
          e.preventDefault();
          this.$el.toggleClass('dragging', true)
        },
      
        leave: function (e) {
          e.preventDefault();
          this.$el.toggleClass('dragging', false);
        },
      
        drop: function (e) {
          e.preventDefault();
          this.fn.on.drag.leave(e);
          this.$el.toggleClass('dropped', true);
          this.fn.on.upload(e);
        }
      },
      
      download: function () {
        if(!this.props.filename) return;
        
        var url = this.props.ctx.canvas.toDataURL();
        var $a = document.createElement('a');
        $a.href = url;
        $a.download = this.props.filename;
        $a.click();
      },
      
      reset: function () {
        localStorage.removeItem('gradient');
        this.fn.on.colour.reset();
      },
      
      colour: {
        reset: function () {
          var gradient = localStorage.getItem('gradient');

          if(gradient) gradient = JSON.parse(gradient);
          else gradient = this.props.gradient.defaults;
                    
          this.props.$color.a.eq(0).value = gradient.a;
          this.props.$color.b.eq(0).value = gradient.b;
          this.props.$color.mid.eq(0).value = gradient.mid;
          this.fn.on.colour.set();
        },
        
        set: function () {
          localStorage.setItem('gradient', JSON.stringify({
            a: this.props.gradient.a = this.props.$color.a.eq(0).value,
            b: this.props.gradient.b = this.props.$color.b.eq(0).value,
            mid: this.props.gradient.mid = this.props.$color.mid.eq(0).value
          }));

          var ctx = this.props.gradient.ctx,
               w = ctx.canvas.width,
               h = ctx.canvas.height,
               gradient = ctx.createLinearGradient(0, 0, w, 0);
          gradient.addColorStop(0, this.props.gradient.a);
          gradient.addColorStop(1, this.props.gradient.b);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, w, h);
          this.fn.on.ready();
        }
      },
      
      upload: function (e) {
        var target = e.dataTransfer ? e.dataTransfer : e.target,
            reader = new FileReader();
        
        if(target.files[0].type.slice(0,5)!=="image") return;
        
        reader.onload = this.fn.on.load;
        this.props.filename = target.files[0].name;
        reader.readAsDataURL(target.files[0]);
      },
      
      load: function (e) {
        
        this.props.$img.eq(0).src = e.target.result;
      },
      
      ready: function () {

        var $img = this.props.$img.eq(0);
        this.props.ctx.canvas.width = $img.naturalWidth;
        this.props.ctx.canvas.height = $img.naturalHeight;
        
        if(!$img.width) return;
        $('.download').removeAttr('disabled')
        
        this.props.ctx.drawImage($img, 0, 0);
        
        var pixels = this.props.ctx.getImageData(0, 0, $img.width, $img.height);
        this.fn.filter.duotone(pixels, this.props.gradient.a, this.props.gradient.b);
        this.props.ctx.putImageData(pixels, 0, 0);
      }
      
    },
    
    filter: {
      grayscale: function (pixels) {
        var d = pixels.data,
            max = 0,
            min = 255;
        
        for (var i=0; i < d.length; i+=4) {
          // Fetch maximum and minimum pixel values
          if (d[i] > max) { max = d[i]; }
          if (d[i] < min) { min = d[i]; }
          
          // Grayscale by averaging RGB values
          var cr = +this.props.gradient.mid,
              r = d[i],
              g = d[i+1],
              b = d[i+2],
              v = cr*r + cr*g + cr*b;
          
          d[i] = d[i+1] = d[i+2] = v;
        }
        
        for (var i=0; i < d.length; i+=4) {
          // Normalize each pixel to scale 0-255
          var v = (d[i] - min) * 255/(max-min);
          
          d[i] = d[i+1] = d[i+2] = v;
        }
        
        return pixels;
      },
      
      gradient: function (tone1, tone2) {
        var rgb1 = this.fn.hexToRgb(tone1),
            rgb2 = this.fn.hexToRgb(tone2),
            gradient = [];
        
        for (var i = 0; i < (256*4); i += 4) {
          gradient[i] = ((256-(i/4))*rgb1[0] + (i/4)*rgb2[0])/256;
          gradient[i+1] = ((256-(i/4))*rgb1[1] + (i/4)*rgb2[1])/256;
          gradient[i+2] = ((256-(i/4))*rgb1[2] + (i/4)*rgb2[2])/256;
          gradient[i+3] = 255;
        }
        
        return gradient;
      },
      
      duotone: function (pixels, tone1, tone2) {
        var grayscale = this.fn.filter.grayscale(pixels),
            gradient = this.fn.filter.gradient(tone1, tone2),
            d = grayscale.data;
        
        for (var i = 0; i < d.length; i += 4) {
          d[i] = gradient[d[i]*4];
          d[i+1] = gradient[d[i+1]*4 + 1];
          d[i+2] = gradient[d[i+2]*4 + 2];
        }
        
        return grayscale;
      }
    },
    
    hexToRgb: function (hex) {
      return [(bigint = parseInt(hex.replace('#', ''), 16)) >> 16 & 255, bigint >> 8 & 255, bigint & 255];
    }
  }
  
}).init();