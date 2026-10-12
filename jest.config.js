/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  transformIgnorePatterns: ["/node_modules/", "\\.(png|jpg|jpeg|svg|gif|webp)$"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(png|jpg|jpeg|gif|webp|svg)$":
      "<rootDir>/src/test/assetStub.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
};