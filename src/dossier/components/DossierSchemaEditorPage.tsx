import { NotificationContainer } from '@dossierhq/design';
import { SchemaEditorScreen } from '@dossierhq/react-components';
import { useState } from 'react';
import { AppDossierProvider } from './AppDossierProvider.jsx';
import { NavBar } from './NavBar.js';

export function DossierSchemaEditorPage() {
  const [_hasChanges, setHasChanges] = useState(false);
  return (
    <AppDossierProvider>
      <NotificationContainer>
        <SchemaEditorScreen
          header={<NavBar current="schema" />}
          onEditorHasChangesChange={setHasChanges}
        />
      </NotificationContainer>
    </AppDossierProvider>
  );
}
