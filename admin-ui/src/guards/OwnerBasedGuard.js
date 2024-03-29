import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

OwnerBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['ROLE_ADMIN', 'ROLE_EDITOR']
  createdBy: PropTypes.object,
  children: PropTypes.node
};

export default function OwnerBasedGuard({ accessibleRoles, createdBy, children }) {
  const { user } = useAuth();
  const { id, roles } = user
  const { translate } = useLocales()

  if (accessibleRoles?.includes(roles.role) || !createdBy || createdBy?.id === id)
    return <>{children}</>;

  return (
    <Container>
      <Alert severity="error">
        <AlertTitle>{translate("message.permissionDeny")}</AlertTitle>
        {translate("message.permissionDenyDescription")}
      </Alert>
    </Container>
  );
}
