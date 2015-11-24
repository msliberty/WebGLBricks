"use strict";

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var gl = WebGLUtils.setupWebGL(canvas);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);


	// TRIANGLES
	var boardPositions = [
		[0, 0, 0],
		[32, 0, 0],
		[0, 32, 0],
		[32, 0, 0],
		[0, 32, 0],
		[32, 32, 0]
	];

	var boardPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boardPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(boardPositions), gl.STATIC_DRAW);

	var boardColor = [0.09, 0.64, 0.28, 1]; // green


	// TRIANGLES
	var exampleBrickPositions = [
		[0, 0, 0],
		[0, 0, 1.5],
		[3, 0, 0],
		[0, 0, 1.5],
		[3, 0, 0],
		[3, 0, 1.5],
		[3, 0, 0],
		[3, 0, 1.5],
		[3, 2, 0],
		[3, 0, 1.5],
		[3, 2, 0],
		[3, 2, 1.5],
		[3, 2, 0],
		[3, 2, 1.5],
		[0, 2, 0],
		[3, 2, 1.5],
		[0, 2, 0],
		[0, 2, 1.5],
		[0, 2, 0],
		[0, 2, 1.5],
		[0, 0, 0],
		[0, 2, 1.5],
		[0, 0, 0],
		[0, 0, 1.5],
		[0, 0, 1.5],
		[0, 2, 1.5],
		[3, 0, 1.5],
		[0, 2, 1.5],
		[3, 0, 1.5],
		[3, 2, 1.5],
	];

	var exampleBrickPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, exampleBrickPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(exampleBrickPositions), gl.STATIC_DRAW);

	var exampleBrickColor = [1, 0, 0, 1]; // red


	var pegPositions = [];
	for (var i = 0; i < 16; ++i) {
		var theta = i * 2 * Math.PI / 16;
		var x = 0.5 + 0.3 * Math.cos(theta);
		var y = 0.5 + 0.3 * Math.sin(theta);
		var xNext = 0.5 + 0.3 * Math.cos(theta + 2 * Math.PI / 16);
		var yNext = 0.5 + 0.3 * Math.sin(theta + 2 * Math.PI / 16);
		pegPositions.push([0.5, 0.5, 2]);
		pegPositions.push([x, y, 2]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([x, y, 1.5]);
		pegPositions.push([x, y, 2]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([x, y, 1.5]);
		pegPositions.push([xNext, yNext, 2]);
		pegPositions.push([xNext, yNext, 1.5]);
	}

	var pegPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pegPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pegPositions), gl.STATIC_DRAW);


	var cameraPosition = [1.5, -5, 4];
	var cameraTarget = [1.5, 1.5, 0];
	function up() {
		return [0, 1, 0];
		//TODO: rework this function, it's not as simple as it seems...

		// if looking straight downward
		if (cameraPosition[0] == cameraTarget[0] && cameraPosition[1] == cameraTarget[1])
			return [0, 1, 0];
		return [0, 0, 1];
	}


	var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
	var positionAttribute = gl.getAttribLocation(program, 'position');
	var modelViewUniform = gl.getUniformLocation(program, 'modelView');
	var projectionUniform = gl.getUniformLocation(program, 'projection');
	var colorUniform = gl.getUniformLocation(program, 'color');


	gl.useProgram(program);

	var modelViewMatrix = lookAt(cameraPosition, cameraTarget, up());
	gl.uniformMatrix4fv(modelViewUniform, false, flatten(modelViewMatrix));

	var projectionMatrix = perspective(60, canvas.width / canvas.height, 0.01, 100);
	gl.uniformMatrix4fv(projectionUniform, false, flatten(projectionMatrix));


	function redraw() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, boardPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniform4fv(colorUniform, flatten(boardColor));
		gl.drawArrays(gl.TRIANGLES, 0, boardPositions.length);

		gl.bindBuffer(gl.ARRAY_BUFFER, exampleBrickPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniform4fv(colorUniform, flatten(exampleBrickColor));
		gl.drawArrays(gl.TRIANGLES, 0, exampleBrickPositions.length);

		gl.bindBuffer(gl.ARRAY_BUFFER, pegPositionBuffer);
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniform4fv(colorUniform, flatten(exampleBrickColor));
		gl.drawArrays(gl.TRIANGLES, 0, pegPositions.length);
	}

	redraw();
};
