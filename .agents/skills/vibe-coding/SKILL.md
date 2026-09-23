---
name: vibe-coding
description: "Vibe coding AI rules and engineering standards: problem clarity, simplicity first, surgical changes, quality gates, test-driven thinking, security rules, and clean architecture."
---

# Vibe Coding AI Rules Skill

This skill enforces high-discipline agentic coding practices adapted from the Vibe Coding Rules suite.

## Core Rules & Principles

### 1. Think Before Coding
- **Problem Clarity First (PCF)**: No code without a clear problem statement and explicit requirements.
- **Reasoning-First (RF)**: Intent → Context → Strategy → Risk.
- **Surface Tradeoffs**: Never make silent assumptions. Present alternatives and ask when uncertain.

### 2. Simplicity First
- **Minimum Viable Code**: The simplest solution that solves the exact problem.
- **No Speculative Engineering**: No features beyond what was asked. No abstractions for single-use code.
- **Dependency Minimalism**: No new libraries without explicit request or compelling justification.

### 3. Surgical Changes
- **Touch Only What You Must**: Never overwrite or break functional code. Clean up only your own changes.
- **Atomic Changes**: Small, self-contained modifications. Complete one file before moving to the next.
- **Preserve Formatting & Comments**: Respect established codebase styles.

### 4. Goal-Driven Execution
- **Verifiable Goals**: Define tests or automated checks before writing implementation code.
- **Edge-Case Coverage**: Identify 3-5 edge cases and ensure the implementation explicitly handles them.

### 5. Quality Gates (Mandatory Verification)
- Chain of verification before declaring done:
  1. Build (`npm run build`)
  2. Lint / Typecheck (`npm run typecheck` or `tsc --noEmit`)
  3. Unit & Integration Tests (`npm test`)
  4. Smoke Test (verification of running server or simulated call)

### 6. Security & Data Protection
- Validate all user inputs with schema validators (Zod).
- Never store secrets or API keys in source code — backend environment variables only.
- Never concatenate raw SQL queries — use parameterized statements.
- Rate limiting on public API endpoints; explicit CORS origin configuration.

## Reference Documentation
- API Design: `./docs/api-design.md`
- Security Rules: `./docs/security-rules.md`
- Performance Rules: `./docs/performance-rules.md`
- Testing Rules: `./docs/testing-rules.md`
- Error Handling: `./docs/error-handling.md`
- Best Practices: `./docs/best-practices.md`
