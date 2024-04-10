const container = document.querySelector(".container");
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
// Global Variables
let draw = false;
let drawRect = false;
let defaultWidth = 5;
let prevX = null;
let prevY = null;
let activeEraser = false;
let defaultBackgroundColor = "#d9d4d0";
let defaultFill = "#020103";
// DOCUMENT ITEMS
let weight = document.getElementById("wgt"); 
let eraser = document.getElementById("eraser"); 
let pencil = document.getElementById("pencil"); 
let drawColor = document.getElementById("drawClr"); 
let toggleGrid = document.getElementById("toggleGrid"); 
let clearBtn = document.querySelector(".clear") 
let saveBtn = document.querySelector(".save"); 
let fileName = document.getElementById("myIllustration"); 
let cvsContainer = document.querySelector(".cvsContainer"); 
let cvsColor = document.getElementById("cvsClr"); 
let expand = document.getElementById("expand");
let settings = document.querySelector(".settings");
// Canvas Background
cvsColor.value = defaultBackgroundColor; // default background color
const setBackground = () => {
    cvsContainer.style.backgroundColor = cvsColor.value
}
// Change background color
cvsColor.addEventListener("change", () => {
    setBackground();
});
// Add or remove grid from canvas 
toggleGrid.addEventListener("change", () => {
    toggleGrid.classList.toggle("slctGrd");
    cvsContainer.classList.toggle("dottedGrid");
});
// Eraser
eraser.addEventListener("click", () => {
    activeEraser = true;
    drawSettings();
});
// Pencil 
pencil.addEventListener("click", () => {
    activeEraser = false;
    drawSettings();
});
drawColor.value = defaultFill; // default strokeStyle
weight.value = defaultWidth; // default lineWidth
// Selected tool and stroke width
const drawSettings = () => {
    if (activeEraser) {
        pencil.classList.remove("selected");
        eraser.classList.add("selected");
        // Eraser lines are transparent
        // Canvas will only display previous drawings that are outside of the eraser lines
        ctx.globalCompositeOperation = "destination-out"; 
    } else {
        ctx.globalCompositeOperation = "source-over";
        pencil.classList.add("selected");
        eraser.classList.remove("selected");
    }
    ctx.strokeStyle = drawColor.value;
    ctx.lineWidth = weight.value;
    ctx.lineCap = "round";
}
// settings
expand.addEventListener("click", () => {
    container.classList.toggle("active");
    settings.classList.toggle("active");
});

// Change strokeStyle 
drawColor.addEventListener("change", drawSettings); 
weight.addEventListener("change", drawSettings); // Change lineWidth
// Window load events
window.addEventListener("load", () => {
    myCanvas.height = myCanvas.offsetHeight;
    myCanvas.width = myCanvas.offsetWidth; 
    fileDate();
    setBackground(); 
    drawSettings(); 
    pencil.classList.add("selected");
});
// Clear canvas 
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
})
// Today's date 
const fileDate = () => {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let saveDate = `${month}-${day}-${year}`; 
    fileName.value = 'Untitled_' + saveDate; // Default fileName
}
// Save drawing
saveBtn.addEventListener("click", () => {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = cvsColor.value;
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = drawColor.value;
    ctx.globalCompositeOperation = "source-over";

    let data = myCanvas.toDataURL("imag/png"); // create image
    let a = document.createElement("a");
    a.href = data;
    // If user doesn't title drawing, use default value of fileName.
    a.download = fileName.value + '.png'; // Download image
    a.click();
})
// Draw on canvas
const drawing = (e) => {
    let currentX = e.offsetX;
    let currentY = e.offsetY;
    
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
}  
myCanvas.addEventListener("mousedown", (e) => draw = true);
myCanvas.addEventListener("mouseup", (e) => draw = false);
// mousedown + mousemove to start drawing
myCanvas.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.offsetX;
        prevY = e.offsetY;
        return;
    }
    drawing(e);
})
