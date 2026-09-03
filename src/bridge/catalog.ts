// dsh-acp-interactive: slash-catalog merge — dsh command-plane entries plus
// user-invocable skills, folded into the ACP `available_commands_update` list.
//
// Zed 1.18 only shows client-side (global/project) skills for native-agent
// connections; for an external ACP agent the ONLY slash surface is the
// `available_commands` the agent announces (the message editor validates any
// typed `/name` against that list). dsh keeps commands and skills in separate
// registries (`ctx.commands` and `ctx.skills`). This module merges the two
// catalogs so the bridge announces one honest slash list. Pure + sync so the
// merge is unit-testable offline.
//
// Naming: like pi-acp's skill commands, skills are announced under the
// `skill:<name>` prefix (`/skill:find-skills`). The bridge's prompt handler
// normalizes a typed `/skill:<name>` back into the bare `/name` gesture so the
// dsh `tool-skill` pre-step hook expands the skill body for the model — the
// same loading path the dsh Web "/" menu uses. Commands keep their plain
// names, and the announcement is partitioned commands-first then skills so the
// flat Zed popup reads as two blocks. Skill descriptions stay plain (the
// `skill:` prefix already marks them in the list).
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

/** Slash-name prefix under which user-invocable skills are announced. */
export const SKILL_SLASH_PREFIX = 'skill:'

/**
 * Normalize one text block's skill tokens back to bare gestures. Zed sends the
 * picked completion verbatim (`/skill:find-skills`), but dsh's `tool-skill`
 * pre-step hook recognizes only the bare `/name` shape (its gesture regex does
 * not accept a colon), so each `skill:<name>` token is rewritten to `/name`
 * before the prompt reaches the model. Only word-bounded `/skill:<kebab>`
 * tokens are touched; anything else passes through untouched.
 */
export function normalizeSkillSlashText(text: string): string {
  return text.replace(/(^|\s)\/skill:([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g, '$1/$2')
}

/**
 * Merge command-plane entries with user-invocable skills into one slash
 * catalog. Skills are announced as `skill:<name>` entries (mirroring pi-acp so
 * the popup reads `/skill:find-skills`); non-user-invocable skills stay out
 * (picking one would silently no-op). The result is partitioned: every command
 * first in registry order, then every skill in registry order, so the flat Zed
 * popup separates the two kinds visually. Commands keep plain names, so a
 * command and a skill can never collide on the wire.
 */
export function mergeSlashCatalog(
  commands: readonly SlashCommandEntry[],
  skills: readonly SlashSkillEntry[],
): SlashCatalogEntry[] {
  const entries: SlashCatalogEntry[] = []
  const commandNames = new Set<string>()
  for (const command of commands) {
    if (commandNames.has(command.name)) continue
    commandNames.add(command.name)
    entries.push({
      name: command.name,
      description: command.description,
      ...(command.inputHint !== undefined && command.inputHint !== null && command.inputHint.length > 0
        ? { input: command.inputHint }
        : {}),
    })
  }
  const skillNames = new Set<string>()
  for (const skill of skills) {
    if (!skill.userInvocable) continue
    if (skillNames.has(skill.name)) continue
    skillNames.add(skill.name)
    entries.push({ name: SKILL_SLASH_PREFIX + skill.name, description: skill.description })
  }
  return entries
}
