export interface PrincipalConfig {
  provider: string;
  identifier: string;
  enableAdmin: boolean;
  readonly?: boolean;
}

const principals = {
  editor: {
    provider: 'sys',
    identifier: 'editor',
    enableAdmin: true,
  },
  reader: {
    provider: 'sys',
    identifier: 'reader',
    readonly: true,
    enableAdmin: false,
  },
} satisfies Record<string, PrincipalConfig>;

export type PrincipalIdentifier = keyof typeof principals;

export function getPrincipalConfig(identifier: PrincipalIdentifier): PrincipalConfig {
  return principals[identifier];
}
