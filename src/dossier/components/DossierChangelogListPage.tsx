import { NotificationContainer } from '@dossierhq/design';
import { ChangelogListScreen } from '@dossierhq/react-components';
import { useUrlSearchParams } from '../hooks/useUrlSearchParams.js';
import { AppDossierProvider } from './AppDossierProvider.jsx';
import { NavBar } from './NavBar.js';

export function DossierChangelogListPage() {
  const [urlSearchParams, setSearchParams] = useUrlSearchParams();
  return (
    <AppDossierProvider>
      <NotificationContainer>
        <ChangelogListScreen
          header={<NavBar current="changelog" />}
          urlSearchParams={urlSearchParams}
          onUrlSearchParamsChange={setSearchParams}
        />
      </NotificationContainer>
    </AppDossierProvider>
  );
}
