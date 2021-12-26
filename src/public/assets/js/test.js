function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
var slideIndex = 1;
showDivs(slideIndex);
function plusDivs(n) {
  showDivs(slideIndex += n);
}
function currentDiv(n) {
  showDivs(slideIndex = n);
}
function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = x.length }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-red", "");
  }
  x[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " w3-red";
}

function add_element(str) {
  var title = document.getElementById('title').value;
  if (title == '') {
    alert("You have not entered the criteria");
  }
  else {
    var html ='<div class="testt"><label class="container">' + title + '<input type="checkbox"><span class ="checkmark"></span></label><input type="number" class="form-control" id="txt_x" placeholder="1"></div>';
    document.getElementById(str).insertAdjacentHTML('afterend', html);
  }
}
function add_element_question() {
  var title = document.getElementById('title1').value;
  if (title == '') {
    alert("You have not entered the question");
  }
  else {
    var html ='<div class="name-question">' + title + '<div class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-sort-down"></i></div></div><div class="collapse" id="collapseExample"><div class="card card-body"><div class="new_criterion"><div id="' + title.toString() + '"></div><input type="text" class="text_add" id="title" placeholder="New Criterion" value=""/> <input type="button" class="button_add" id="button_add" onclick="add_element(' + title.toString() + ')" value="Add"/></div></div></div>';
    document.getElementById('result1').insertAdjacentHTML('afterend', html);
  }
}

const initCanvas = (id) => {
  return new fabric.Canvas(id, {
      // width: 630,
      width: 1050,
      height: 891,
      selection: false
  });
}

const setBackground = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
      canvas.crossOrigin = "Anonymous";
      canvas.add(img).setActiveObject(img);
      canvas.backgroundImage = img;
      canvas.renderAll()
  })
}

const toggleMode = (mode) => {
  if (mode === modes.pan) {
      if (currentMode === modes.pan) {
          currentMode = ''
      } else {
          currentMode = modes.pan
          canvas.isDrawingMode = false
          canvas.renderAll()
      }
  } else if (mode === modes.drawing) {
      if (currentMode === modes.drawing) {
          currentMode = ''
          canvas.isDrawingMode = false
          canvas.renderAll()
      } else {
          currentMode = modes.drawing
          canvas.freeDrawingBrush.color = color
          canvas.isDrawingMode = true
          canvas.renderAll()
      }      
  }
}

const setPanEvents = (canvas) => {
  canvas.on('mouse:move', (event) => {
      // console.log(event)
      if (mousePressed && currentMode === modes.pan) {
          canvas.setCursor('grab')
          canvas.renderAll()
          const mEvent = event.e
          const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
          canvas.relativePan(delta)
      }
  })
  // keep track of mouse down/up
  canvas.on('mouse:down', (event) => {
      mousePressed = true;
      if (currentMode === modes.pan) {
          canvas.setCursor('grab')
          canvas.renderAll()
      }
  })
  canvas.on('mouse:up', (event) => {
      mousePressed = false
      canvas.setCursor('default')
      canvas.renderAll()
  })
}

const setColorListener = () => {
  const picker = document.getElementById('colorPicker')
  picker.addEventListener('change', (event) => {
      console.log(event.target.value)
      color = '#' + event.target.value
      canvas.freeDrawingBrush.color = color
      canvas.requestRenderAll()
  })
}

const clearCanvas = (canvas, state) => {
  state.val = canvas.toSVG()
  canvas.getObjects().forEach((o) => {
      if(o !== canvas.backgroundImage) {
          canvas.remove(o)
      }
  })
}

const removeLastCanvas = (canvas, state) => {
  state.val = canvas.toSVG()
  if(canvas.getObjects().length !== 0){
      var last = canvas.item(canvas.getObjects().length -1)
      canvas.remove(last)
      // canvase.requestRenderAll()
  }
}

const restoreCanvas = (canvas, state, bgUrl) => {
  if (canvas.getObjects().length == 1) {
      if (state.val) {
          fabric.loadSVGFromString(state.val, objects => {
            console.log(objects)
              objects = objects.filter(o => true)
              canvas.add(...objects)
              canvas.requestRenderAll()
          })
      }
  }
}

const save = () => {
  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL("image/png");
  // var newTab = window.open('about:blank','image from canvas');
  // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
  var a = document.createElement('a');
  a.href = dataURL;
  a.download = 'Graded-photo.jpeg';
  a.click();

}

const createText = () => {
  var itext = new fabric.IText('This is a Text box', {
    left: 100,
    top: 150,
    fill:  canvas.freeDrawingBrush.color,
    strokeWidth: 2,
    stroke: canvas.freeDrawingBrush.color,
  });
  canvas.add(itext);
  canvas.requestRenderAll()
}

const createRect = (canvas) => {
  const canvCenter = canvas.getCenter()
  const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'rgba(0,0,0,0)',
      stroke: canvas.freeDrawingBrush.color,
      opacity: 1,
      left: canvCenter.left,
      top: -50,
      originX: 'center',
      originY: 'center',
      cornerColor: 'white'
  })
  canvas.add(rect)
  
  rect.animate('top', canvCenter.top, {
      onChange: canvas.renderAll.bind(canvas)
  });
  rect.on('selected', () => {
      canvas.renderAll()
  })
  rect.on('deselected', () => {
      canvas.renderAll()
  })
  add_element();
}

const createCirc = (canvas) => {
  console.log("circ")
  const canvCenter = canvas.getCenter()
  const circle = new fabric.Circle({
      radius: 50,
      fill: 'rgba(0,0,0,0)',
      stroke: canvas.freeDrawingBrush.color,
      left: canvCenter.left,
      top: -50,
      originX: 'center',
      originY: 'center',
      cornerColor: 'white'
  })
  canvas.add(circle)
  canvas.renderAll()
  circle.animate('top', canvCenter.top, {
      onChange: canvas.renderAll.bind(canvas),
    });
  circle.on('selected', () => {
      canvas.requestRenderAll()
  })
  circle.on('deselected', () => {
      canvas.requestRenderAll()
  })
}

const groupObjects = (canvas, group, shouldGroup) => {
  if (shouldGroup) {
      const objects = canvas.getObjects()
      group.val = new fabric.Group(objects, {cornerColor: 'white'})
      clearCanvas(canvas, svgState)
      canvas.add(group.val)
      canvas.requestRenderAll()
  } else {
      group.val.destroy()
      let oldGroup = group.val.getObjects()
      clearCanvas(canvas, svgState)
      canvas.add(...oldGroup)
      group.val = null
      canvas.requestRenderAll()
  }
}

const imgAdded = (e) => {
  const inputElem = document.getElementById('myImg')
  const file = inputElem.files[0];
  reader.readAsDataURL(file)
}

const canvas = initCanvas('canvas')
const svgState = {}
let mousePressed = false
let color = '#000000'
const group = {}
var backgound = document.getElementById("background").getAttribute("value");
console.log("background:" + backgound)
const bgUrl = 'uploads/images/'+ backgound;
// const bgUrl = 'uploads/images/thao-1539608118744779383055.jpg'
// const bgUrl = 'https://scontent.fdad1-3.fna.fbcdn.net/v/t1.15752-9/s403x403/261801332_517853622519045_3052491554156041144_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=aee45a&_nc_ohc=G-xoy3yw6ooAX-e-k8t&_nc_ht=scontent.fdad1-3.fna&oh=0f862f6d7ea1734ff229e9c9f197713e&oe=61DB9BE9'

let currentMode;

const modes = {
  pan: 'pan',
  drawing: 'drawing'
}
const reader = new FileReader()

setColorListener()
setBackground(bgUrl, canvas)
setPanEvents(canvas)

const inputFile = document.getElementById('myImg');
inputFile.addEventListener('change', imgAdded)

reader.addEventListener("load", () => {
  fabric.Image.fromURL(reader.result, img => {
      canvas.add(img)
      canvas.requestRenderAll()
  })
})



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

var slideIndex = 1;
  showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = x.length }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-red", "");
  }
  x[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " w3-red";
}

function add_element() {
  var title = document.getElementById('title').value;
  if (title == '') {
    alert("You have not entered the criteria");
  }
  else {
    var html ='<div id="criterion" class="testt"><label class="container" value= " '+ title + '">' + title + '<input name="checkbox" class="checkbox" id="checkbox" type="checkbox" onclick="checkMark()"><span class ="checkmark"></span></label><input type="number" class="form-control" id="InputPoints" value="1"></div>';
    document.getElementById('result').insertAdjacentHTML('afterend', html);
  }
}

function checkMark() {
  var $boxes = $('input[name=checkbox]');
  var elements = document.getElementsByClassName('form-control');
  var sumPoints = 0;
  $boxes.each(function(k, val){
    var active = val.checked ? 1 : 0;
    console.log("ative:" + active)
    if (active == 1) {
      sumPoints += Number(elements[k].value);
    }
  })
  var elem = document.getElementById("total_point");
  elem.innerText = sumPoints;
  console.log(sumPoints)
}

function next_student() {
  var criterion_name = document.getElementsByClassName('container');
  var elements = document.getElementsByClassName('form-control');
  var totalPoint = document.getElementsByClassName('total_point');
  var studentName = document.getElementsByClassName('list-group-item-student');
  var questionName = document.getElementsByClassName('question');
  var currentPage = document.getElementById("currentPage").getAttribute('value')
  var maxPage = document.getElementById("maxPage").getAttribute('value')
  var $boxes = $('input[name=checkbox]');

  var body = {
    "studentName" : studentName[0].innerText,
    "totalPoint" : totalPoint[0].innerText,
  };
  for (var i = 0; i < questionName.length; i++) {
    var criteria = [];
    $boxes.each(function(k, val){
      var active = val.checked ? 1 : 0;
      criteria[k] = {"checkbox": active, "criterion_name": criterion_name[k].innerText ,"score": elements[k].value}
    })
      body.question = [
        {
          questionName : questionName[i].innerText, 
          criteria
        }
      ];
  }
  
  fetch('/mark?page='+(currentPage), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  var next_page = Number(currentPage) + 1;
  if (next_page >= maxPage) {
    window.location = "http://localhost:3000/mark?page=0";
  } else {
    window.location = "http://localhost:3000/mark?page=" + next_page;
  }
}

function previous_student(){
  var criterion_name = document.getElementsByClassName('container');
  var elements = document.getElementsByClassName('form-control');
  var totalPoint = document.getElementsByClassName('total_point');
  var studentName = document.getElementsByClassName('list-group-item-student');
  var questionName = document.getElementsByClassName('question');
  var currentPage = document.getElementById("currentPage").getAttribute('value')
  var maxPage = document.getElementById("maxPage").getAttribute('value')
  var $boxes = $('input[name=checkbox]');

  var body = {
    "studentName" : studentName[0].innerText,
    "totalPoint" : totalPoint[0].innerText,
  };
  for (var i = 0; i < questionName.length; i++) {
    var criteria = [];
    $boxes.each(function(k, val){
      var active = val.checked ? 1 : 0;
      criteria[k] = {"checkbox": active, "criterion_name": criterion_name[k].innerText ,"score": elements[k].value}
    })
      body.question = [
        {
          questionName : questionName[i].innerText, 
          criteria
        }
      ];
  }
  
  fetch('/mark?page='+(currentPage), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  var previous_page = Number(currentPage) - 1;
  if (previous_page < 0) {
    var previous_page = Number(maxPage) - 1;
    window.location = "http://localhost:3000/mark?page=" + previous_page;
  } else {

    window.location = "http://localhost:3000/mark?page=" + previous_page;
  }
}




