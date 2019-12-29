/**
 * Preparacion de integracion de imagenes y entrenamiento de la red cocossd con el sistema de mobilenet via 
 * tf.data.webcam 
 * 
 * Para ello debemos estudiar bien la importacion del clasificador knn ya que es un sistema totalmente aparte del modelo
 * sin embargo se usa la inferencia entre el knn y el modelo para crear la capa de activacion... ok ok....
 * puede ser una noche interesante de cojones.
 * 
 */



/**
 * Prescindimos de TFjs local y pasamos a @module import
 * para poder usar bien las librerias audio video, que en principio segun sabemos no es necesario 
 * ni siquiera importarlo ya que node los resuelve por defecto.
 * 
 * La movida es que lo hemos instalado por npm pero tenemos que usarlo como script
 * 
 * Analizamos el paquete y los "modulos" rapidamente
 */
//declaramos la variable para controlar que el video no esta listo
let videoTFready = false;
let tflock = false;
var videook, audio, words, score;


//detectar cuando hay datos de video y audio, es decir cargar los modelos para posteriormente poder tenerlo disponible cuando tf esta activado

detectVideoData();
audioDetect();

//Bloqueamos el uso de tensorflow hasta que el boton de activacion sea pulsado
function activateTF(){


  if(tflock == false){

    tflock = true;
    // igual meter todo el troncho aqui mal no...
    
    videoDetect()
    
    //el audio hay que joderse y cargarlo al principio
    //audioPredict(); //tecnicamente para el entrenamiento hay que deshacerse de esta funcion que ya la habiamos comentado el ensuremodelloaded.... blabla
    
    //llamamos a la limpieza de la gpu
    //videoClean();
    console.log("Tensorflow va a mostrar las predicciones de video y audio.");

    //console.log("Tensorflow va a activarse, pero si no se han cargado correctamente los inicializadores fallaran las predicciones de video y audio.");
      //usar tensorflow para reconocer cada X segundos esos datos
      //videoDetect();
    
  }else{

    tflock = false;
    console.log("Tensorflow va a desactivarse");

    document.getElementById('tfdebugclas').innerHTML = ''
    document.getElementById('tfdebugprob').innerHTML = ''
    document.getElementById('tfdebugsound').innerHTML = ''
    
    

    //Como detener la ejecucion de tensorflow... muy sencillo con clearTimeout
    clearTimeout("videoDetect()");
    //clearTimeout("audioPredict()");
    audio.stopListening();

  }

}




function detectVideoData(){

  let videoDetector = new MutationObserver( function(mutations){
    mutations.forEach(function(mutation){
      if(mutation.target.id == 'arjs-video'  ){
        //console.log(mutation);
        videoTFready = true;
        videook = document.getElementById('arjs-video');
      }
    });
  });

  videoDetector.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
  

}
/*
function videoClean(){
  setTimeout("videoClean()", 10000);
  //cocoSsd.dispose();
  console.log("Limpiamos la gpu cada 10 segundos");
}*/

function videoDetect(){
  
  setTimeout("videoDetect()", 5000);
  
  if(videoTFready){

      cocoSsd.load(
      //aqui usaremos los metodos especificos para cargar bien el modelo
      {
        base: 'lite_mobilenet_v2',
        modelUrl:'/public/models/videObjects/model.json'
      }
      ).then(model => {          
        //console.log("El valor actual del video con el modelo cargado: ",videook);
        model.detect(videook).then(predictions => {
          //model.classify(videotf).then(predictions => {
            if(predictions){
                if(tflock){
                  document.getElementById('tfdebugclas').innerHTML = JSON.stringify(predictions[0].class) 
                  document.getElementById('tfdebugprob').innerHTML = (JSON.stringify(predictions[0].score*100).slice(0,2)) + "%"
                  console.log("Cada 5 segundos reciclamos");
                  console.log("Usamos dispose en la instancia")
                  model.dispose(); // crash event en 1 min ... test 1
                }else{
                  console.log("Mmmm do you wanna see the truth")
                }
            }
          }).catch((e)=>{
            console.log("Error en las predicciones de video: ", e)
            document.getElementById('tfdebugclas').innerHTML = "Que mierda es eso?"

          });
        }).catch(e => {
          console.log("Error de tipo : ", e , " cargando el modelo")
        });
        
    }
  }

 async function audioDetect(){
   
  audio = speechCommands.create('BROWSER_FFT', '18w');
  
  await audio.ensureModelLoaded();
  buildModel();
  console.log("El audio creado con el modelo cargado es algo asi, y ademas estamos entrenando con nuevos samples para 3 valores left right noise:" , audio);

  //audioPredict(); tec

}


// importante usar asincronia en la funcion ya que en conjuncion con la importacion de modulos node y uso via script tag en cojunto con speech-commands, hemos comenzado a ver posibiliad de detectar audio y ademas hemos solucionado la problematica de t.backend y de audio context.
async function audioPredict() {

  //setTimeout("audioPredict(audio)", 3000);

  //const 
  words = audio.wordLabels();

  await audio.listen(({scores}) => {
   
    scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
    console.log("Parece que hay scores:", scores);

    scores.sort((s1,s2) => s2.score - s1.score);

    //tflock ? 
    document.getElementById('tfdebugsound').innerHTML = scores[0].word
    //: console.log("Silence is gold...")
    
  }, {
    includeSpectrogram: true,
    probabilityThreshold: 0.90
  });
  
    //document.getElementById('tfdebugsoundlist').innerHTML = JSON.stringify(audio.wordLabels());

}

function onArjsDataLog(){
  
  ArjsDataLog = !ArjsDataLog;
  ArjsDataLog ? console.log("Arjs Log Activado") : console.log("Arjs Log Desactivado")
  
}

function onDataSendReady(){
  unityDataSendReady = !unityDataSendReady;
  unityDataSendReady ? console.log("Unity Sync Activado") : console.log("Unity Sync Desactivado")
}


//var unityDataSendReady = false;
//var ArjsDataLog = false;


/**
 * Ejemplo de codigo de entrenamiento para el audio
 * 
 * Tener en cuenta que las funciones de prediccion estan integradas en el codigo superior para el 18w actual
 *  por tanto la variable recognizer se refactoriza a audio.
 * 
 */

 const NUM_FRAMES = 3;
 const INPUT_SHAPE = [NUM_FRAMES, 232, 1];
 let model;
 let examples = []; // jajajajaja ojo ojo...

 function collect(label){
  if(audio.isListening()){
    return audio.stopListening();
  }
  if(label == null) return;

  audio.listen(async ({spectrogram:{frameSize, data}})=> {
    let vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
    examples.push({vals,label});
    document.querySelector('#console').textContent = 
      `${examples.length} examples grabados`;
  },{
    overlapFactor:0.999,
    includeSpectrogram: true,
    invokeCallbackOnNoiseAndUnknown: true
  });
 }

 function normalize(x){
   const mean = -100;
   const std = 10;
   return x.map(x => (x-mean) / std);
 }


 async function train(){
   toggleButtons(false);
   const ys = tf.oneHot(examples.map(e => e.label), 3);
   const xsShape = [examples.length, ...INPUT_SHAPE];
   const xs = tf.tensor(flatten(examples.map(e => e.vals)), xsShape);

   await model.fit(xs, ys , {
     batchSize: 16,
     epochs:10,
     callbacks:{
       onEpochEnd: (epoch, logs) => {
         document.querySelector('#console').textContent = 
         `Eficiencia: ${(logs.acc * 100 ).toFixed(1)}% Epoch: ${epoch + 1}`;
       }
     }
   });
   tf.dispose([xs, ys]);
   toggleButtons(true);
 }

 function buildModel(){
   model = tf.sequential();
   model.add(tf.layers.depthwiseConv2d({
     depthMultiplier: 8,
     kernelSize: [NUM_FRAMES, 3],
     activation: 'relu',
     inputShape: INPUT_SHAPE
   }));
   model.add(tf.layers.maxPooling2d({
     poolSize: [1,2],
     strides: [2,2]
   }));
   model.add(tf.layers.flatten());
   model.add(tf.layers.dense({
     units:3,
     activation: 'softmax'
   }));
   const optimizer = tf.train.adam(0.01);
   model.compile({
     optimizer,
     loss: 'categoricalCrossentropy',
     metrics: ['accuracy']
   });
 }

 function toggleButtons(enable){
   document.querySelectorAll('button').forEach(b => b.disabled = !enable);
 }

 function flatten(tensors){
   const size = tensors[0].length;
   const result = new Float32Array(tensors.length * size);
   tensors.forEach((arr, i) => result.set(arr, i * size));
   return result;
 }

 async function moveSlider(labelTensor){
   const label = (await labelTensor.data())[0];
   document.getElementById('console').textContent = label;

   if(label == 2){
     return;
   }

   let delta = 0.1;
   const prevValue = +document.getElementById('output').value;
   document.getElementById('output').value = prevValue + (label === 0 ? -delta : delta);
 }

 function listen(){
   if(audio.isListening()){
      audio.stopListening();
      toggleButtons(true);
      document.getElementById('listen').textContent = 'Dime...';
      return
   }
   toggleButtons(false);
   document.getElementById('listen').textContent = 'Calla...';
   document.getElementById('listen').disabled = false;

   audio.listen(async ({ spectrogram: {frameSize, data}}) => {
     const vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
     const  input = tf.tensor(vals, [ 1, ...INPUT_SHAPE]);
     const  probs = model.predict(input);
     const  predLabel = probs.argMax(1);
     await moveSlider(predLabel);
     tf.dispose([input, probs, predLabel]);
   }, {
     overlapFactor: 0.999,
     includeSpectrogram: true,
     invokeCallbackOnNoiseAndUnknown: true
   });
 }