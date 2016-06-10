'use strict'
var fs = require('fs')

class FileStorageService{
  static getInstance(storeName){
    switch(storeName){
      case 'sheet':{
        return new FileStorageService('store/sheet.json');
      }
    }
    throw new Error('cannot find storage service...' + storeName);
  }
  
  constructor(storePath){
    this.storePath = storePath;
    var dataStr = fs.readFileSync(this.storePath);
    this.data = JSON.parse(dataStr);
    this.locked = false;
    this.dirty = false;
    
    setInterval(this.write.bind(this), 2000);
  }
  
  write(){
    if (this.locked || !this.dirty){
      return;
    }
    this.locked = true;
    fs.writeFile(this.storePath, JSON.stringify(this.data), function(err){
      if (err) {
        console.err(err);
        throw new Error('data sync failed...');
      }
      this.locked = false;
      this.dirty = false;
      console.log('data synced');
    }.bind(this));
  }
  
  save(id, obj){
    this.data[id] = obj;
    this.dirty = true;
  }
  
  load(id){
    return this.data[id];
  }
    
}

module.exports = FileStorageService;