---
org: Hewlett Packard Enterprise
trace: SUMMER
roles:
  - title: ASIC verification/design intern
    label: HPE INTERN
    short: HPE
    start: 2026-05
    end: 2026-08
    summary: >
      Built an agentic AI framework that generates, verifies, and debugs post-silicon tests.
    tags: [asic-verification, ai-agents, networking]
---

## Overview

- Migrated our team's entire post-silicon test suite for a networking switch from the legacy test framework to the new hybrid one: 115 working tests, plus a few that were already failing on legacy and now fail identically on hybrid
- Built an agentic AI pipeline that converts each test, verifies it against the legacy version, and debugs failures, which surfaced bugs in the hybrid modeling engine and topo builder along the way
- Made it safe to run unattended overnight with deterministic checks, a strict per-test file allowlist, and escalation documents for anything outside that scope
- The team estimated that converting by hand would have taken several engineers a few months. Converting a test now takes one prompt to Copilot

## Background

From a post-silicon perspective, most of the testing on a networking switch can be roughly defined as traffic in, traffic out. A test sends data in and checks that it was received, mirrored, dropped, etc. the way it's expected to be.

Each test is made up of many configuration tables. In our existing architecture ("legacy" tests), these tables have to be populated manually. Our new test framework ("hybrid" tests) automates much of this.

I was responsible for migrating all of our legacy tests to the hybrid framework. This turned out to be nontrivial because of a host of issues in the hybrid modeling engine and in topo builder, the tool that automates table generation.

## Challenges

For each conversion, the working legacy test served as a golden baseline. Generating the new test was relatively trivial, while verifying it and debugging the modeling engine and topo builder took about 10x longer. A single test run took 45-90 minutes, and every time it failed, the failure had to be diagnosed as an issue with the converted test, the modeling engine, or topo builder. The long runtime made any change that could affect other tests especially costly, since a regression on the entire test suite took several days.

## Agent Pipeline

I approached the migration and the infrastructure debugging as one effort. I built an agentic AI pipeline that converts legacy tests to the hybrid architecture and verifies them, and in the process it caught bugs in the modeling engine and topo builder and attempted to debug them safely.

Scaling this to an entire test suite meant handing off the triage and debugging to AI without case-by-case approval. To do that safely, I made the process as rigid and deterministic as possible:

1. When a test fails, a set of scripts checks for mismatches in the test logs, glaring issues in the packet summary, etc. This catches known, straightforward problems before an agent gets involved.
2. If the scripts don't catch the problem, whatever they flagged goes to a debug subagent, along with debugging tips I collected from the engineers on my team.
3. Lastly, an escalation framework. Each test has a strict allowlist of files it can edit. If the debug agent decides a change outside that scope is required, it first tests alternate solutions that stay in scope, then tries the out-of-scope fix in a sandbox. If that works, it writes a document explaining the issue and the proposed fix, and justifying why going out of scope was necessary.

This let me run the agent safely overnight and come back in the morning to a few escalation documents that I could work through quickly with my team.

## Results

The pipeline converted the entire working legacy test suite: 115 tests, plus a few extras that were still failing on legacy and were converted equivalently, producing the exact same errors on hybrid.

I was also intentional about leaving behind thorough documentation and keeping the interface extremely simple. It's one prompt to Copilot, after which it clearly points to any escalation documents or failing logs that need an engineer's eyes, so anyone on the team can easily convert more legacy tests in the future.

My work was critical to the team's move to the hybrid test framework. By their estimates, they would otherwise have dedicated several engineers across a few months to converting the tests by hand. That's a lot of time saved on the initial conversion, and more saved on any tests they convert later on.

## Skills Demonstrated
- Post-silicon validation
- Networking ASIC test development
- Agentic AI workflow design
- Test automation at scale
- Failure triage and debugging
- Technical documentation

## Tools Used
- GitHub Copilot


