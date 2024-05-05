import type { Entity } from '@dossierhq/core';
import { NotificationContainer } from '@dossierhq/design';
import { ContentListScreen } from '@dossierhq/react-components';
import { useUrlSearchParams } from '../hooks/useUrlSearchParams.js';
import { AppDossierProvider } from './AppDossierProvider.jsx';
import { NavBar } from './NavBar.js';

export function DossierContentListPage() {
  const [urlSearchParams, setSearchParams] = useUrlSearchParams();
  return (
    <AppDossierProvider>
      <NotificationContainer>
        <ContentListScreen
          header={<NavBar current="content" />}
          urlSearchParams={urlSearchParams}
          onUrlSearchParamsChange={setSearchParams}
          onOpenEntity={handleEntityOpen}
          onCreateEntity={handleCreateEntity}
        />
      </NotificationContainer>
    </AppDossierProvider>
  );
}

function handleCreateEntity(type: string) {
  window.location.assign(`/dossier/content/edit?new=${type}:${crypto.randomUUID()}`);
}

function handleEntityOpen(entity: Entity) {
  window.location.assign(`/dossier/content/edit?id=${entity.id}`);
}
