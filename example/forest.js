var createTerrain = require('voxel-perlin-terrain');

var createEngine = require('voxel-engine');
var game = createEngine({
    generateVoxelChunk: createTerrain(2, 32),
    chunkDistance: 2,
    materials: [ 'bedrock', 'tree_side', 'leaves' ]
});
game.controls.pitchObject.rotation.x = -1.5;
game.appendTo('#container');
window.game = game;

var createTree = require('../');
createTree(game, { bark: 2 });
createTree(game, { bark: 2 });
createTree(game, { bark: 2 });
createTree(game, { bark: 2 });
createTree(game, { bark: 2 });
createTree(game, { bark: 2 });

var explode = require('voxel-debris')(game);
game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var erase = true
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');
