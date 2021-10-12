
const brs = require('brs-js');
const fs = require('fs');
const path = require('path');

const fontParser = require('./util.fontParser.js');
const { moveBricks, ParseTool, WriteTool } = require('./util.tool.js');



const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function storeCoordinate(xVal, yVal, zVal, array) {
    array.push({x: xVal, y: yVal, z: zVal});
}


var coords = [];
var ore_coords = [];

const ores = Object.fromEntries(fs.readdirSync(__dirname + '/ores')
  .map(f => f.match(/ore_([a-z0-9_]+)\.brs/))
  .filter(f => f)
  .map(match => {
    try {
      return [match[1], __dirname + '/ores/' + match[0]];
    } catch (err) {
      console.error('Error parsing ore', match[1], ':', err);
    }
  })
  .filter(v => v));


    const file = ores['1'];
    const parser = new ParseTool(brs.read(fs.readFileSync(file)));


class InfinMiner {
  // the constructor also contains an omegga if you don't want to use the global one
  // config and store variables are optional but provide access to the plugin data store
  constructor(omegga, config, store) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }


  // teleport a player to a position
  static teleport(name, [x, y, z]) {
    Omegga.writeln(`Chat.Command /TP "${name}" ${x} ${y} ${z}`);
  }

  loadOre(location = [0,0,4]){

      const tool = new WriteTool(parser.save).empty();
      parser.save.bricks.forEach((item, i) => {
        let roll1 = Math.floor(Math.random() * 36 + 1);
        if(roll1 == 1){
        let roll = Math.floor(Math.random() * 4 + 1);
        if(roll == 1)
          parser.save.bricks[0].color = [0,0,0];
        if(roll == 2)
          parser.save.bricks[0].color = [0,255,0];
        if(roll == 3)
          parser.save.bricks[0].color = [0,20,110];
        if(roll == 4)
          parser.save.bricks[0].color = [222,205,0];
        if(roll == 5)
          parser.save.bricks[0].color = [0,255,110];
        }

      });
        tool.addBrick(...moveBricks(parser.save.bricks ,location ));
      let save = tool.write();

        parser.save.bricks[0].color = [150,150,150];
      if (save.bricks.length === 0) return;
      // load the text save data as this owner
      Omegga.loadSaveData(save, {quiet: true});
  }

  async stuff(player){
      try {
let [x, y, z] = await player.getPosition();
    for(var z1 = -6; z1 < 3; z1++){
      for(var x1 = -4; x1 < 4; x1++){
        for(var y1 = -4; y1 < 4; y1++){
      var x2 = Math.floor(x/40)+x1;
      var y2 = Math.floor(y/40)+y1;
      var z2 = Math.floor(z/40)+z1;


      var foundBlockAt = false;
              for (var i = 0; i < coords.length; i++) {
                if(coords[i].x == x2 && coords[i].y == y2 && coords[i].z == z2){
                  foundBlockAt=true;
                }
              }


      if(foundBlockAt){

      }else{
        let pos = [x2*40,y2*40,z2*40];
        this.loadOre(pos);
        storeCoordinate(x2,y2,z2,coords);
      }
    }
  }
    }
    } catch (e) {
      Omegga.broadcast('{}',e);
    }
  }

  async init() {
    Omegga
      .on('chatcmd:infinityminer', name => {
        const player = Omegga.getPlayer(name);
        if (player){
          InfinMiner.teleport(name, [100,100,100*50]);
          this.call(player);
		    }
      });

    // determine of rules should be display on join
      Omegga.on('join', async player => {
        InfinMiner.teleport(player.name, [100,100,100*50]);
            this.call(player);
      });

        Omegga.broadcast("heartbeat test");
  }

  async call(player){
    try{
        await sleep(500);
        var foundBlockAt = false;

          let [x, y, z] = await player.getPosition();
          x = Math.floor(x/40);
          y = Math.floor(y/40);
          z = Math.floor(z/40);

      //  for (var i = 0; i < coords.length; i++) {
      //    if(coords[i].x == x && coords[i].y == y && coords[i].z == z){
      //      foundBlockAt=true;
      //    }
      //  }
      //  if(foundBlockAt == false){
          this.stuff(player);
      //  }
      this.call(player);
    }catch(e){
      this.call(player);
    }
  }

  async stop() {}
}

module.exports = InfinMiner;
