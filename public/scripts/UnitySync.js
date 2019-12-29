// INIT
var target = "Unity";
var unityDataSendReady = false;
var ArjsDataLog = false;
var unitylog = "false";
// controlar con unityInstanceReadyFunc

//funcion log unity data received
function UnityLog(component, unitylog){ gameInstance.SendMessage(component,"UnityLog",unitylog)}

//posicion          
function PosSyncX(component,posx){ gameInstance.SendMessage(component,"PosSyncX",posx); }
function PosSyncY(component,posy){ gameInstance.SendMessage(component,"PosSyncY",posy); }
function PosSyncZ(component,posz){ gameInstance.SendMessage(component,"PosSyncZ",posz); }

 //quaternions
function QuatSyncX(component,quatx){ gameInstance.SendMessage(component,"QuatSyncX",quatx); }
function QuatSyncY(component,quaty){ gameInstance.SendMessage(component,"QuatSyncY",quaty); }
function QuatSyncZ(component,quatz){ gameInstance.SendMessage(component,"QuatSyncZ",quatz); } 
function QuatSyncW(component,quatw){ gameInstance.SendMessage(component,"QuatSyncW",quatw); }