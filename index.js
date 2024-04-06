#!/usr/bin/env node
const fs = require('fs');
const {getPathFromArgs, createResourceArray, isStateMachineResource} = require("./utils");
const {fnJoin} = require("./parser");

const parse = (path) => {
    const cfnStackJson = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const stateMachineResources = createResourceArray(cfnStackJson, isStateMachineResource)

    stateMachineResources.map(writeAsl)
}

const writeAsl = (stateMachineResource, key) => {
    const definition = stateMachineResource.Properties.DefinitionString;
    const nestedDefinitionString = definition["Fn::Join"];
    if (!nestedDefinitionString) {
      console.log("In definition string format, skipping asl generation...")
      return;
    }
    const asl = fnJoin(nestedDefinitionString)
    fs.writeFileSync(`asl-${key}.json`, asl);
}

parse(getPathFromArgs(process.argv))