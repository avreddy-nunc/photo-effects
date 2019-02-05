(function () {
    var img = document.getElementById('originalImageElement');
    img.onload =  function () {
        resizeImage();
    };
    Caman.remoteProxy = Caman.IO.useProxy('php');
    Caman.remoteProxy = "../staticcontent/admin/templates/photo-manipulation/proxies/caman_proxy.php";
    var effect = {
        brightness : {
            min : -100,
            max: 100,
            value : 0
        },
        contrast : {
            min : -100,
            max: 100,
            value : 0
        },
        saturation : {
            min : -100,
            max: 100,
            value : 0
        },
        vibrance : {
            min : -100,
            max: 100,
            value : 0
        },
        exposure : {
            min : -100,
            max: 100,
            value : 0
        },
        hue : {
            min : 0,
            max: 100,
            value : 0
        },
        sepia : {
            min : 0,
            max: 100,
            value : 0
        },
        noise : {
            min : 0,
            max: 100,
            value : 0
        },
        clip : {
            min : 0,
            max: 100,
            value : 0
        },
        sharpen : {
            min : 0,
            max: 100,
            value : 0
        },
        stackBlur : {
            min : 0,
            max: 100,
            value : 0
        }
    };
    var isRendering = false;
    var presets = [
        {filter:'vintage',name : 'Vintage'},
        {filter:'lomo',name:'Lomo'},
        {filter: 'clarity', name:'Clarity'},
        {filter:'sinCity', name:'Sin City'},
        {filter: 'sunrise', name: 'Sunrise'},
        {filter: 'crossProcess', name:'Cross Process'},
        {filter:'orangePeel', name: 'Orange Peel'},
        {filter:'grungy', name:'Grungy'},
        {filter:'jarques', name : 'Jarques'},
        {filter:'pinhole', name: 'Pin Hole'},
        {filter:'oldBoot', name:'Old Boot'},
        {filter: 'glowingSun', name : 'Glowing Sun'},
        {filter: 'hazyDays', name : 'Hazy Days'},
        {filter: 'herMajesty', name : 'Her Majesty'},
        {filter: 'nostalgia', name : 'Nostalgia'}
    ];
    var selectedPresets = [];
    renderFilters();
    renderPresets();
    resetEffect();
    if(default_exposure){
        renderImage();
    }
    function resizeImage() {
        var camanImageElement = document.getElementById('image-camanImage');
        //console.log('called');
        var canvas = document.createElement("canvas");
        canvas.width = camanImageElement.width;
        canvas.height = camanImageElement.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, camanImageElement.width, camanImageElement.height);
        camanImageElement.src = canvas.toDataURL("image/png");
    }
    function resetEffect() {
        effect = {
            brightness : {
                min : -100,
                max: 100,
                value : 0
            },
            contrast : {
                min : -100,
                max: 100,
                value : 0
            },
            saturation : {
                min : -100,
                max: 100,
                value : 0
            },
            vibrance : {
                min : -100,
                max: 100,
                value : 0
            },
            exposure : {
                min : -100,
                max: 100,
                value : default_exposure?default_exposure : 0
            },
            hue : {
                min : 0,
                max: 100,
                value : 0
            },
            sepia : {
                min : 0,
                max: 100,
                value : 0
            },
            noise : {
                min : 0,
                max: 100,
                value : 0
            },
            clip : {
                min : 0,
                max: 100,
                value : 0
            },
            sharpen : {
                min : 0,
                max: 100,
                value : 0
            },
            stackBlur : {
                min : 0,
                max: 100,
                value : 0
            }
        };
        selectedPresets = [];
        //document.getElementById('selectedFiltersCount').innerText = selectedPresets.length;
        for(var key in effect){
            document.getElementById(key+'Range').value = effect[key].value;
            document.getElementById(key+'RangeValue').innerText = effect[key].value;
        }
        document.querySelectorAll('.filter-item.selected').forEach(function (elem) {
            elem.classList.remove('selected');
        });
        document.getElementById('save').disabled = true;
        document.getElementById('reset').disabled = true;
    }
    function renderPresets() {
        var parEl = document.getElementById('filtersContainer');
        for(var i=0;i<presets.length;i++){
            (function () {
                var presetEl = document.createElement('div');
                presetEl.classList.add('filter-item');
                presetEl.id = presets[i].filter;
                presetEl.innerHTML = '<img src="media/caman-min.jpg" alt="'+presets[i].name+'" id="image-'+presets[i].filter+'">\n' +
                    '            <h6>'+presets[i].name+'</h6>\n' +
                    '            <div class="select-overlay"></div>';
                parEl.appendChild(presetEl);
                var preset = presets[i].filter;
                Caman('#image-'+preset, function () {
                    this[preset]();
                    this.render();
                });
            })();
        }
    }
    function renderImage(){
        //document.getElementById('selectedFiltersCount').innerText = 'loading';
        if(!isRendering) {
            isRendering = true;
            document.getElementById('loader').style.display = 'flex';
            Caman('#image-camanImage', function () {
                this.revert(false);
                for (var i = 0; i < selectedPresets.length; i++) {
                    this[selectedPresets[i]]();
                }
                for (var key in effect) {
                    this[key](effect[key].value);
                }
                this.render(function () {
                    /*=== This is the callback function of image rendering=== */
                    //document.getElementById('selectedFiltersCount').innerText = 'completed';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('save').disabled = false;
                    document.getElementById('reset').disabled = false;
                    isRendering = false;
                });
            });
        }
    }
    function renderFilters(){
        var el,
            parentEl = document.getElementById('effectsContainer');
        for (var key in effect ){
            el = document.createElement('div');
            el.classList.add('col-6');
            el.classList.add('effect-item');
            el.innerHTML = '<h6>'+key+'</h6>\n' +
                '            <div class="slidecontainer">\n' +
                '                <input type="range" min="'+effect[key].min+'" max="'+effect[key].max+'" value="range" title="effect range" id="'+key+'Range" class="slider effectRange" name="'+key+'" />\n' +
                '            <p id="'+key+'RangeValue" style="margin: 0;width: 25px;text-align: right;">0</p>\n' +
                '            </div>';
            parentEl.appendChild(el);
        }
    }
    function sliderInputChange(e){
        if(effect[e.target.name]!==undefined){
            effect[e.target.name].value = Number(e.target.value);
        }
        document.getElementById(e.target.name+'RangeValue').innerText = effect[e.target.name].value;
        renderImage();
    }
    var sliders = document.getElementsByClassName('effectRange');
    var i = sliders.length;
    while(i--){
        sliders[i].addEventListener('change', sliderInputChange);
        sliders[i].addEventListener('input', sliderInputRangeChange)
    }
    function sliderInputRangeChange(e){
        if(effect[e.target.name]!==undefined){
            effect[e.target.name].value = Number(e.target.value);
        }
        document.getElementById(e.target.name+'RangeValue').innerText = effect[e.target.name].value;
    }
    var presetSelected = function(e) {
        if(!isRendering) {
            if (e.currentTarget.classList.contains('selected')) {
                selectedPresets.splice(selectedPresets.indexOf(e.currentTarget.id), 1);
                e.currentTarget.classList.remove('selected');
            } else {
                selectedPresets.push(e.currentTarget.id);
                e.currentTarget.classList.add('selected');
            }
            //document.getElementById('selectedFiltersCount').innerText = selectedPresets.length;
            //console.log(selectedPresets);
            renderImage();
        }
    };
    var presetSelectors = document.getElementsByClassName('filter-item');
    var j = presetSelectors.length;
    while (j--){
        presetSelectors[j].addEventListener('click', presetSelected);
    }
    document.getElementById('reset').addEventListener('click', function () {
        if(!isRendering){
            isRendering = true;
            if(default_exposure){
                default_exposure = 0;
            }
            resetEffect();
            Caman('#image-camanImage', function () {
                this.revert(true);
                this.render(function () {
                    isRendering = false;
                });
            })
        }

    });
    document.getElementById('save').addEventListener('click', function () {
        document.getElementById('saveLoader').style.display = 'flex';
        Caman('#originalImageElement', function () {
            this.revert(false);
            for(var i = 0 ;i<selectedPresets.length;i++){
                this[selectedPresets[i]]();
            }
            for(var key in effect){
                this[key](effect[key].value);
            }
            this.render(function () {
                var canvas = document.getElementById('originalImageElement');
                var img = canvas.toDataURL('image/jpeg');
                /*var xhttp = new XMLHttpRequest();
                var form  = document.getElementById('uploadimageform');
                var url = form.UPLOAD_URL.value;
                xhttp.open("POST", url, true);
                xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhttp.onreadystatechange = function() {
                    if(xhttp.readyState == 4 && xhttp.status == 200) {
                        var response = JSON.parse(xhttp.responseText);
                        if(response.error)
                        {
                            alert(response.msg);
                            document.getElementById('saveLoader').display = 'flex';
                            return false;
                        }
                        //return false;
                        document.getElementById('saveLoader').display = 'flex';
                        window.location.href = response.redirect_url;
                    }
                };
                xhttp.send('csrf_token='+form.csrf_token.value+'&ImageData='+img);*/
                setTimeout(function () {
                    document.getElementById('saveLoader').style.display = 'none';
                },2000)
            });
        });
    });
    document.getElementById('toggleOriginal').addEventListener('change', function (e) {
        if(e.target.checked){
            document.getElementById('effectsContainer').style.display = 'none';
            document.getElementById('originalImage').style.display = 'block';
            document.getElementById('orignalText').innerText = 'Hide original';
        }else{
            document.getElementById('effectsContainer').style.display = 'flex';
            document.getElementById('originalImage').style.display = 'none';
            document.getElementById('orignalText').innerText = 'Show original';
        }
    })
}());