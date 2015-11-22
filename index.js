"use strict";

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var gl = WebGLUtils.setupWebGL(canvas);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
	var positionAttribute = gl.getAttribLocation(program, 'position');
	var colorUniform = gl.getUniformLocation(program, 'color');

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
