// dsh-acp-interactive: slash-catalog merge — dsh command-plane entries plus
// user-invocable skills, folded into the ACP `available_commands_update` list.
//
// Zed 1.18 only shows client-side (global/project) skills for native-agent
// connections; for an external ACP agent the ONLY slash surface is the
// `available_commands` the agent announces (the message editor validates any
// typed `/name` against that list). dsh keeps commands and skills in separate
// registries (`ctx.commands` and `ctx.skills`), and its own Web composer
// exposes both under "/": commands run on the command plane, and picking a
// user-invocable skill inserts its `/name` token, which the `tool-skill`
// pre-step hook expands into the skill body for the model. This module merges
// the two catalogs the same way so the bridge can announce one honest slash
// list. Pure + sync so the merge is unit-testable offline.
//
// Presentation choices (Zed has no agent-side way to split the popup into
// Commands/Skills/Actions — those groups are client-only for native agents):
//  * Commands are announced first, user-invocable skills second, each block in
//    registry order — a stable partition instead of one alphabetized soup, so
//    the flat popup reads as a command block then a skill block.
//  * Skill descriptions gain a visible "Skill: " prefix for hover tooltips.
//
// Adapted from the zed-dsh project (https://github.com/dangpangch/zed-dsh, MIT)
// — same-author port; design.zh.md §6.6 and protocol-map.md §1 still apply.

/** One dsh command-plane entry as ctx.commands.list() reports it. */
export interface SlashCommandEntry {
  readonly name: string
  readonly description: string
  /** Advertised free-form input hint (dsh CommandDescriptor.input.hint). */
  readonly inputHint?: string | null
}

/** One ctx.skills summary as the registry reports it. */
export interface SlashSkillEntry {
  readonly name: string
  readonly description: string
  /** Resolved invocation policy: may a human invoke this skill via "/"? */
  readonly userInvocable: boolean
}

/** One merged announcement entry — the exact input contract of commandsUpdate(). */
export interface SlashCatalogEntry {
  readonly name: string
  readonly description?: string | null
  /** Free-form input hint; commandsUpdate wraps it as AvailableCommandInput. */
  readonly input?: string | null
}

/** Display marker added to skill descriptions in the slash popup. */
const SKILL_DESCRIPTION_PREFIX = 'Skill: '

/**
 * Merge command-plane entries with user-invocable skills into one slash
 * catalog. Registered commands win name collisions (a same-named skill token
 * would never reach the model), non-user-invocable skills stay out (picking
 * one would silently no-op), and the result is partitioned: every command
 * first in registry order, then every skill in registry order. Within each
 * block the caller's order is preserved (both dsh registries already return
 * name-sorted rows), so announcement folds stay stable across sessions and
 * catalog refreshes while the flat popup separates the two kinds visually.
 */
export function mergeSlashCatalog(
  commands: readonly SlashCommandEntry[],
  skills: readonly SlashSkillEntry[],
): SlashCatalogEntry[] {
  const seen = new Set<string>()
  const entries: SlashCatalogEntry[] = []
  for (const command of commands) {
    if (seen.has(command.name)) continue
    seen.add(command.name)
    entries.push({
      name: command.name,
      description: command.description,
      ...(command.inputHint !== undefined && command.inputHint !== null && command.inputHint.length > 0
        ? { input: command.inputHint }
        : {}),
    })
  }
  for (const skill of skills) {
    if (!skill.userInvocable) continue
    if (seen.has(skill.name)) continue
    seen.add(skill.name)
    entries.push({ name: skill.name, description: SKILL_DESCRIPTION_PREFIX + skill.description })
  }
  return entries
}
