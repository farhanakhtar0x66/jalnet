import { App } from "aws-cdk-lib";
import { JalnetStack } from "./stack.js";

// Environment-agnostic synth performs no account lookup or AWS access.
new JalnetStack(new App(), "JalNetDev");
