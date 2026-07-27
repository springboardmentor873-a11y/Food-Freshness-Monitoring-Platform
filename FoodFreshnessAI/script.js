const API_URL="https://lent-barge-napkin.ngrok-free.dev/predict";

const imageInput=document.getElementById("imageInput");
const previewImage=document.getElementById("previewImage");
const analyzeBtn=document.getElementById("analyzeBtn");
const loading=document.getElementById("loading");
const resultSection=document.getElementById("resultSection");
const resetBtn=document.getElementById("resetBtn");


const foodCategory=document.getElementById("foodCategory");
const freshness=document.getElementById("freshness");
const edible=document.getElementById("edible");
const confidenceBar=document.getElementById("confidenceBar");
const confidenceText=document.getElementById("confidenceText");
const shelfLife=document.getElementById("shelfLife");
const recommendation=document.getElementById("recommendation");

let selectedFile=null;
let historyData=JSON.parse(localStorage.getItem("freshnessHistory"))||[];


imageInput.addEventListener("change",function(e){

selectedFile=e.target.files[0];

if(selectedFile){

fileName.innerText=selectedFile.name;
fileSize.innerText=(selectedFile.size/1024).toFixed(2)+" KB";
fileFormat.innerText=selectedFile.type.split("/")[1].toUpperCase();

const reader=new FileReader();

reader.onload=function(event){

previewImage.src=event.target.result;

const img=new Image();

img.onload=function(){

imageResolution.innerText=img.width+" x "+img.height+" px";

};

img.src=event.target.result;

};

reader.readAsDataURL(selectedFile);

}

});



analyzeBtn.addEventListener("click",async function(){

if(!selectedFile){

alert("Please upload an image first");
return;

}

loading.classList.remove("hidden");
resultSection.classList.add("hidden");


const formData=new FormData();

formData.append("file",selectedFile);


try{

const response=await fetch(API_URL,{
method:"POST",
body:formData
});


const data=await response.json();

console.log(data);

displayResult(data);

saveHistory(data);

}

catch(error){

console.error(error);

alert("Unable to connect with AI server");

}


loading.classList.add("hidden");

});



function displayResult(data){

foodCategory.innerText=data.category || "-";

freshness.innerText=data.condition || "-";

edible.innerText=data.edibility_percent+"%" || "-";

confidenceText.innerText=data.category_confidence+"%";

confidenceBar.style.width=data.category_confidence+"%";

shelfLife.innerText=data.shelf_life || "-";


if(data.condition==="Fresh"){

recommendation.innerText="Store properly to maintain freshness.";

}

else if(data.condition==="Spoiling"){

recommendation.innerText="Consume soon before spoilage increases.";

}

else if(data.condition==="Rotten"){

recommendation.innerText="Discard immediately.";

}

else{

recommendation.innerText="Monitor storage conditions.";

}


resultSection.classList.remove("hidden");

}



function saveHistory(data){

const reader=new FileReader();

reader.onload=function(e){

historyData.unshift({

image:e.target.result,

category:data.category,

freshness:data.condition,

edible:data.edibility_percent+"%",

confidence:data.category_confidence,

shelf_life:data.shelf_life

});


localStorage.setItem(
"freshnessHistory",
JSON.stringify(historyData)
);


displayHistory();

};


reader.readAsDataURL(selectedFile);

}



function displayHistory(){

const container=document.getElementById("historyContainer");

container.innerHTML="";


historyData.forEach(item=>{


container.innerHTML+=`

<div class="history-card">

<img src="${item.image}" class="history-image">

<div class="history-details">

<div class="history-title">
ANALYSIS COMPLETE
</div>

<p>Food: ${item.category}</p>

<p>Freshness: ${item.freshness}</p>

<p>Edible: ${item.edible}</p>

<p>Confidence: ${item.confidence}%</p>

<p>Shelf Life: ${item.shelf_life}</p>

</div>

</div>

`;

});

}



resetBtn.addEventListener("click",function(){

selectedFile=null;

imageInput.value="";

previewImage.removeAttribute("src");

fileName.innerText="-";
fileSize.innerText="-";
imageResolution.innerText="-";
fileFormat.innerText="-";

foodCategory.innerText="-";
freshness.innerText="-";
edible.innerText="-";
confidenceText.innerText="-";
confidenceBar.style.width="0%";
shelfLife.innerText="-";
recommendation.innerText="-";

resultSection.classList.add("hidden");

});
const fruitImages=[
"food/apple.png",
"food/banana.png",
"food/carrot.png",
"food/cucumber.png",
"food/grapes.png",
"food/mango.png",
"food/orange.png",
"food/peach.png",
"food/potato.png",
"food/strawberry.png",
"food/tomato.png",
"food/watermelon.png"
];

window.addEventListener("DOMContentLoaded",function(){

const floatingBackground=document.getElementById("floatingBackground");

if(floatingBackground){

const totalFruits=250;

let positions=[];

for(let i=0;i<totalFruits;i++){

const fruit=document.createElement("img");

fruit.src=fruitImages[Math.floor(Math.random()*fruitImages.length)];

fruit.className="floating-food";


let leftPosition;

do{

leftPosition=Math.random()*95;

}
while(
positions.some(pos=>Math.abs(pos-leftPosition)<4)
);

positions.push(leftPosition);


fruit.style.left=leftPosition+"%";

fruit.style.top=(Math.random()*120-20)+"vh";

fruit.style.width="55px";

fruit.style.height="55px";

fruit.style.animationDuration="30s";

fruit.style.animationDelay=-(Math.random()*30)+"s";

fruit.style.opacity="0.18";


floatingBackground.appendChild(fruit);

}

}

});
displayHistory();
