module.exports = {
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
    },
    testEnvironment: "jsdom",
  
    moduleNameMapper: {
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/fileMock.js",
        "\\.(css|less|sass|scss)$": "<rootDir>/styleMock.js"
      }
      
  };
  