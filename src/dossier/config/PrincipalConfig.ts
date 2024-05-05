export interface PrincipalConfig {
  provider: string;
  identifier: string;
  enableFull: boolean;
  readonly?: boolean;
}

const principals = {
  editor: {
    provider: 'sys',
    identifier: 'editor',
    enableFull: true,
  },
  reader: {
    provider: 'sys',
    identifier: 'reader',
    readonly: true,
    enableFull: false,
  },
} satisfies Record<string, PrincipalConfig>;

export type PrincipalIdentifier = keyof typeof principals;

export function getPrincipalConfig(identifier: PrincipalIdentifier): PrincipalConfig {
  return principals[identifier];
}
