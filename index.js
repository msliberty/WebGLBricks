"use strict";

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var gl = WebGLUtils.setupWebGL(canvas);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);


	//////////////////// Shapes 'n' stuff ////////////////////

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


	//////////////////// Perspective ////////////////////

	var cameraTarget = [16, 16, 0];
	var cameraDistance = 32;
	var cameraAzimuth = 0; // radians measured from the negative y-axis towards the positive x-axis
	var cameraInclination = Math.PI / 16; // radians measured from the xy-plane towards the positive z-axis

	var minCameraInclination = 0.01;
	var maxCameraInclination = Math.PI / 2 - 0.01;
	var minCameraDistance = 1;
	var maxCameraDistance = 80;

	function cameraPosition() {
		var x = cameraDistance * Math.cos(cameraInclination) * Math.sin(cameraAzimuth) + cameraTarget[0];
		var y = -cameraDistance * Math.cos(cameraInclination) * Math.cos(cameraAzimuth) + cameraTarget[1];
		var z = cameraDistance * Math.sin(cameraInclination) + cameraTarget[2];
		return [x, y, z];
	}


	//////////////////// Shaders ////////////////////

	var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
	var positionAttribute = gl.getAttribLocation(program, 'position');
	var modelViewUniform = gl.getUniformLocation(program, 'modelView');
	var projectionUniform = gl.getUniformLocation(program, 'projection');
	var colorUniform = gl.getUniformLocation(program, 'color');


	//////////////////// Input ////////////////////

	canvas.oncontextmenu = function(e) { e.preventDefault(); } // capture right-click

	function dragModeFromMouseEvent(e) {
		if (e.buttons === 0) return null;

		if (e.ctrlKey || e.metaKey || e.altKey) {
			// simulate mouse buttons with keyboard
			// left button = ctrl or meta (windows logo on windows, command on os x)
			// right button = alt
			// middle button = left and right simultaneously

			if ((e.ctrlKey || e.metaKey) && e.altKey)
				return 'translate';
			if (e.ctrlKey || e.metaKey)
				return 'rotate';
			if (e.altKey)
				return 'zoom';
		}

		var leftButton = e.buttons & 1;
		var rightButton = e.buttons & 2;
		var middleButton = e.buttons & 4 || (leftButton && rightButton);//TODO

		if (middleButton)
			return 'translate';
		if (leftButton)
			return 'rotate';
		if (rightButton)
			return 'zoom';
		return null;
	}

	var rotateSensitivity = 1 / 500;
	var translateSensitivity = 1 / 50;
	var zoomSensitivity = 1 / 40;
	canvas.onmousemove = function(e) {
		var dragMode = dragModeFromMouseEvent(e);
		if (dragMode === null) return;

		if (dragMode === 'rotate') {
			cameraAzimuth -= e.movementX * rotateSensitivity;
			cameraAzimuth %= 2 *Math.PI;

			cameraInclination += e.movementY * rotateSensitivity;
			if (cameraInclination < minCameraInclination)
				cameraInclination = minCameraInclination;
			else if (cameraInclination > maxCameraInclination)
				cameraInclination = maxCameraInclination;
		} else if (dragMode === 'translate') {
			cameraTarget[0] -= e.movementX * translateSensitivity * Math.cos(cameraAzimuth);
			cameraTarget[1] -= e.movementX * translateSensitivity * Math.sin(cameraAzimuth);
			cameraTarget[0] -= e.movementY * translateSensitivity * Math.sin(cameraAzimuth);
			cameraTarget[1] += e.movementY * translateSensitivity * Math.cos(cameraAzimuth);
		} else if (dragMode === 'zoom') {
			cameraDistance -= e.movementY * zoomSensitivity;
			if (cameraDistance < minCameraDistance)
				cameraDistance = minCameraDistance;
			else if (cameraDistance > maxCameraDistance)
				cameraDistance = maxCameraDistance;
		}
	};


	//////////////////// Drawing ////////////////////

	gl.useProgram(program);

	function redraw() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var modelViewMatrix = lookAt(cameraPosition(), cameraTarget, [0, 0, 1]);
		gl.uniformMatrix4fv(modelViewUniform, false, flatten(modelViewMatrix));

		var projectionMatrix = perspective(60, canvas.width / canvas.height, 0.01, 100);
		gl.uniformMatrix4fv(projectionUniform, false, flatten(projectionMatrix));

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

	function handleAnimationFrame() {
		requestAnimationFrame(handleAnimationFrame);
		redraw();
	}
	requestAnimationFrame(handleAnimationFrame);
};
