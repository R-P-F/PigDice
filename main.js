"use strict";
let thread1 = null;
let thread2 = null;
let thread3 = null;
let worker1;
let worker2;
let worker3;

function startThreads() {
  if (window.Worker) {
    if (thread1 == null) {
      thread1 = new Blob([returnTreadScript()], { "type": 'application/javascript' });
      var url1 = window.URL || window.webkitURL;
      var blobUrl1 = url1.createObjectURL(thread1);
      worker1 = new Worker(blobUrl1);
      let button = document.querySelector("button");
      button.innerText = "Start Thread 2";
      worker1.onmessage = function (e) {
        let game1 = document.getElementById(1);
        game1.innerText = e.data[0];

      }

      worker1.postMessage("thread1");
      return;

    } if (thread2 == null) {
      thread2 = new Blob([returnTreadScript()], { "type": 'application/javascript' });
      var url2 = window.URL || window.webkitURL;
      var blobUrl2 = url2.createObjectURL(thread2);
      worker2 = new Worker(blobUrl2);
      let button = document.querySelector("button");
      button.innerText = "Start Thread 3";
      worker2.onmessage = function (e) {
        let game2 = document.getElementById(2);
        game2.innerText = e.data[0];
      }
      worker2.postMessage("thread2");
      return;
    }
    if (thread3 == null) {
      thread3 = new Blob([returnTreadScript()], { "type": 'application/javascript' });
      var url3 = window.URL || window.webkitURL;
      var blobUrl3 = url3.createObjectURL(thread3);
      worker3 = new Worker(blobUrl3);
      let button = document.querySelector("button");
      button.innerText = "Kill All Threads";
      worker3.onmessage = function (e) {
        let game3 = document.getElementById(3);
        game3.innerText = e.data[0];
      }
      worker3.postMessage("thread3");
      return;
    }
    if (worker1 != undefined && worker2 != undefined && worker3 != undefined) {
      worker1.terminate();
      worker2.terminate();
      worker3.terminate();
      let button = document.querySelector("button");
      button.innerText = "Refresh";
      return;
    }


  }
  else {
    console.log("This browser does not support web workers.");
  }
}



function pigDie(gameId) {
  this.score = 0;
  this.id = gameId;
  this.max = 0;
  this.rolls = 0;
  this.tStart = null;

  this.rollDie = function () {
    return Math.ceil(Math.random() * 6);
  }

  this.log = function () {
    console.log(
      'Game ID: ' + this.id +
      ' High score: ' +
      this.max +
      ' Total Rolls: ' +
      this.formateLarge(this.rolls) +
      " Elapsed Time: " + this.getTime() + "s");
  }

  this.getTime = function () {

    return (Math.ceil(Date.now() / 1000)) - this.tStart;
  }

  this.updateRole = function (roll) {
    this.rolls++;
    if (roll < 2) {
      this.score = 0;
      return;
    }
    else {
      this.score += roll;
      if (this.score > this.max) {
        this.max = this.score;
      }
    }
  }

  this.start = function (target) {
    this.tStart = Math.ceil(Date.now() / 1000);
    while (this.max < target) {

      this.updateRole(this.rollDie());
      if (this.rolls % 100000000 == 0) {
        this.log();
      }
    }
    this.log();
  }

  this.formateLarge = function (lNumber) {
    return lNumber.toLocaleString();

  }

}



function returnTreadScript() {
  return `onmessage = function (e) {
    var x = new pigDie(e.data);
    x.start(500);
  }
  function pigDie(gameId) {
    this.score = 0;
    this.id = gameId;
    this.max = 0;
    this.rolls = 0;
    this.tStart = null;
  
    this.rollDie = function () {
      return Math.ceil(Math.random() * 6);
    }
  
    this.log = function () {
      postMessage([
        'Game ID: ' + this.id + 
        ' High score: ' + 
        this.max + 
        ' Total Rolls: ' +  
        this.formateLarge(this.rolls) + 
      " Elapsed Time: " +this.getTime() + "s"] );
    }
  
    this.getTime = function () {
  
      return ((Math.ceil(Date.now() / 10)) - this.tStart)/100;
    }
  
    this.updateRole = function (roll) {
      this.rolls++;
      if (roll < 2) {
        this.score = 0;
        return;
      }
      else {
        this.score += roll;
        if (this.score > this.max) {
          this.max = this.score;
        }
      }
    }
  
    this.start = function (target) {
      this.tStart = Math.ceil(Date.now() / 10);
      while (this.max < target) {
  
        this.updateRole(this.rollDie());
        if (this.rolls % 1000000 == 0) {
          this.log();
        }
      }
      this.log();
    }
  
    this.formateLarge = function (lNumber) {
      return lNumber.toLocaleString();
  
    }
  
  }`;
}