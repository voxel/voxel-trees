module.exports = function (game, opts) {
    if (!opts) opts = {};
    if (opts.bark === undefined) opts.bark = 1;
    if (opts.leaves === undefined) opts.leaves = 2;
    if (!opts.height) opts.height = Math.floor(Math.random() * 16) + 4;
    
    var voxels = game.voxels;
    var bounds = boundingChunks(voxels.chunks);
    var step = voxels.chunkSize * voxels.cubeSize;
    if (!opts.position) {
        var chunk = voxels.chunks[randomChunk(bounds)];
        opts.position = {
            x: (chunk.position[0] + Math.random()) * step,
            y: (chunk.position[0] + Math.random()) * step,
            z: (chunk.position[0] + Math.random()) * step
        };
    }
    
    var pos = { x: opts.position.x, y: opts.position.y, z: opts.position.z };
    
    var ymax = bounds.y.max * step;
    var ymin = bounds.y.min * step;
    if (occupied(pos.y)) {
        for (var y = pos.y; occupied(y); y += voxels.cubeSize);
        if (y >= ymax) return false;
        pos.y = y;
    }
    else {
        for (var y = pos.y; !occupied(y); y -= voxels.cubeSize);
        if (y <= ymin) return false;
        pos.y = y + voxels.cubeSize;
    }
    function occupied (y) {
        var pos_ = { x: pos.x, y: y, z: pos.z };
        return y <= ymax && y >= ymin && voxels.voxelAtPosition(pos_);
    }
    
    var updated = {};
    for (var y = 0; y < opts.height; y++) {
        var pos_ = { x: pos.x, y: pos.y, z: pos.z };
        pos_.y += y * voxels.cubeSize;
        if (set(pos_, opts.bark)) break;
    }
    Object.keys(updated).forEach(function (key) {
        game.showChunk(updated[key]);
    });
    
    function set (pos, value) {
        var ex = voxels.voxelAtPosition(pos);
        if (ex) true;
        voxels.voxelAtPosition(pos, value);
        var c = voxels.chunkAtPosition(pos);
        var key = c.join('|');
        if (!updated[key]) updated[key] = voxels.chunks[key];
    }
};

function randomChunk (bounds) {
    var x = Math.random() * (bounds.x.max - bounds.x.min) + bounds.x.min;
    var y = Math.random() * (bounds.y.max - bounds.y.min) + bounds.y.min;
    var z = Math.random() * (bounds.z.max - bounds.z.min) + bounds.z.min;
    return [ x, y, z ].map(Math.floor).join('|');
}

function boundingChunks (chunks) {
    return Object.keys(chunks).reduce(function (acc, key) {
        var s = key.split('|');
        if (acc.x.min === undefined) acc.x.min = s[0]
        if (acc.x.max === undefined) acc.x.max = s[0]
        if (acc.y.min === undefined) acc.y.min = s[1]
        if (acc.y.max === undefined) acc.y.max = s[1]
        if (acc.z.min === undefined) acc.z.min = s[2]
        if (acc.z.max === undefined) acc.z.max = s[2]
        
        acc.x.min = Math.min(acc.x.min, s[0]);
        acc.x.max = Math.max(acc.x.max, s[0]);
        acc.y.min = Math.min(acc.y.min, s[1]);
        acc.y.max = Math.max(acc.y.max, s[1]);
        acc.z.min = Math.min(acc.z.min, s[2]);
        acc.z.max = Math.max(acc.z.max, s[2]);
        
        return acc;
    }, { x: {}, y: {}, z: {} });
}
