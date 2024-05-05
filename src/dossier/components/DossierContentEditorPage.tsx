import { NotificationContainer } from '@dossierhq/design';
import { ContentEditorScreen } from '@dossierhq/react-components';
import { useState } from 'react';
import { useUrlSearchParams } from '../hooks/useUrlSearchParams.js';
import { AppDossierProvider } from './AppDossierProvider.jsx';
import { NavBar } from './NavBar.js';

export function DossierContentEditorPage() {
  const [urlSearchParams, setSearchParams] = useUrlSearchParams();
  const [_hasChanges, setHasChanges] = useState(false);

  //TODO warn if hasChanges

  return (
    <AppDossierProvider>
      <NotificationContainer>
        <ContentEditorScreen
          header={<NavBar current="content" />}
          urlSearchParams={urlSearchParams}
          onUrlSearchParamsChange={setSearchParams}
          onEditorHasChangesChange={setHasChanges}
        />
      </NotificationContainer>
    </AppDossierProvider>
  );
}
