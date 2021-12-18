main();

function main() {
    if(app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) {
            alert("Please select a composition");
            return false;
        }
    
    if(app.project.activeItem.selectedLayers.length != 1) {
        alert("Please select 1 layer");
        return false;
        }
var comp = app.project.activeItem;
var layer = comp.selectedLayers[0];

app.beginUndoGroup("Setup");
//var calculatedWidth = Math.floor((layer.outPoint-layer.inPoint)*(Math.floor(1/comp.frameDuration)));
var calculatedWidth = (layer.outPoint-layer.inPoint)*(Math.floor(1/comp.frameDuration));
var calculatedHeight = comp.height;
var newComp = app.project.items.addComp(layer.name+"_warped", comp.width, calculatedHeight, 1, comp.width/Math.floor(1/comp.frameDuration), Math.floor(1/comp.frameDuration));

var layers = [];
var wipeOne, wipeTwo;
for(var i = 0; i < calculatedWidth; i++) {
    if(i == 0) {
    layers.push(newComp.layers.add(layer.source));
    wipeOne = layers[0].Effects.addProperty("ADBE Linear Wipe");
    //wipeOne.property(1).expression = 'timeToFrames()*(100/timeToFrames())';
    wipeOne.property(1).expression = 'timeToFrames()*(100/(outPoint*Math.floor(1/thisComp.frameDuration)-inPoint*Math.floor(1/thisComp.frameDuration)))';
    wipeTwo = layers[0].Effects.addProperty("ADBE Linear Wipe");
    wipeTwo.property(2).setValue(270);
    wipeTwo.property(1).expression = '100-timeToFrames()*(100/(outPoint*Math.floor(1/thisComp.frameDuration)-inPoint*Math.floor(1/thisComp.frameDuration)))-.05';
    } else {
    layers.push(layers[i-1].duplicate());
    layers[layers.length-1].property("ADBE Transform Group").property("ADBE Position").setValue(layers[layers.length-2].property("ADBE Transform Group").property("ADBE Position").value+[1, 0]);
    layers[layers.length-1].startTime-=comp.frameDuration;
        }
    }
newComp.openInViewer();
app.endUndoGroup();
}