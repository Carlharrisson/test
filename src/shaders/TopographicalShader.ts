const TopographicalShader = {
  vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float elevation = sin(modelPosition.x * 10.0 + uTime) * 
                         sin(modelPosition.y * 10.0 + uTime) * 0.1;
        vElevation = elevation;
        modelPosition.z += elevation;
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
      }
    `,
  fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        float colorStrength = (vElevation + 0.1) * 0.5;
        gl_FragColor = vec4(vec3(colorStrength), 1.0);
      }
    `,
};

export default TopographicalShader;
