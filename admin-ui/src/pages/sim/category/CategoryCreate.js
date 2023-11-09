import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Box, Container } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import ErrorOccur from '../../../components/ErrorOccur';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import useLocales from '../../../hooks/useLocales';
import CategoryNewForm from '../../../sections/sim/category/CategoryNewForm';

// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, categories } = useSelector((state) => state.category);

  const category = categories.find((t) => t.id === parseInt(id, 10));

  return (
    <Page title={isNew ? translate('sim.category.newCategory') : category?.title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('sim.category.newCategory') : category?.title}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.sim'),
              href: PATH_DASHBOARD.sim.root,
            },
            {
              name: translate('menu.category'),
              href: PATH_DASHBOARD.sim.products,
            },
            { name: isNew ? translate('sim.category.newCategory') : category?.title || '' },
          ]}
        />
        {error && (isEdit || isView) ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) : (
          <CategoryNewForm isEdit={isEdit} currentItem={isEdit || isView ? category : null} isView={isView} />
        )}
      </Container>
    </Page>
  );
}
