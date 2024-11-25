module.exports = {
    testEnvironment: "jest-environment-jsdom", // Simule un DOM
    transform: {
      "^.+\\.js$": "babel-jest" // Utilise Babel pour transformer les fichiers JS
    }
  };  