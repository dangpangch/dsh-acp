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

/**
 * Merge command-plane entries with user-invocable skills into one
 * deterministic slash catalog. Commands win name collisions (a registered
 * command executes on the command plane and a same-named skill token would
 * never reach the model), non-user-invocable skills stay out (picking one
 * would silently no-op), and the result is name-sorted so announcement folds
 * are stable across sessions and catalog refreshes.
 */
export function mergeSlashCatalog(
  commands: readonly SlashCommandEntry[],
  skills: readonly SlashSkillEntry[],
): SlashCatalogEntry[] {
  const byName = new Map<string, SlashCatalogEntry>()
  for (const command of commands) {
    if (!byName.has(command.name)) {
      byName.set(command.name, {
        name: command.name,
        description: command.description,
        ...(command.inputHint !== undefined && command.inputHint !== null && command.inputHint.length > 0
          ? { input: command.inputHint }
          : {}),
      })
    }
  }
  for (const skill of skills) {
    if (!skill.userInvocable) continue
    if (byName.has(skill.name)) continue
    byName.set(skill.name, { name: skill.name, description: skill.description })
  }
  return [...byName.values()].sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
}
