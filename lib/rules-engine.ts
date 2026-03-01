import type { Category, Rule } from "@prisma/client";

export type RuleWithCategory = Rule & { category: Category };

export function applyRules(
  description: string,
  rules: RuleWithCategory[]
): RuleWithCategory | null {
  for (const rule of rules) {
    const { pattern, matchType } = rule;
    let matched = false;

    if (matchType === "KEYWORD") {
      matched = description.toLowerCase().includes(pattern.toLowerCase());
    } else if (matchType === "EXACT") {
      matched = description === pattern;
    } else if (matchType === "REGEX") {
      try {
        matched = new RegExp(pattern, "i").test(description);
      } catch {
        matched = false;
      }
    }

    if (matched) return rule;
  }

  return null;
}
