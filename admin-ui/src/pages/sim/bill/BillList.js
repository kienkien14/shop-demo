import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import Iconify from '../../../components/Iconify';
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// sections
import ConfirmDialog from '../../../components/ConfirmDialog';
import ErrorOccur from '../../../components/ErrorOccur';
// sections

import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import DataGridMoreMenu from '../../../components/datagrid/DataGridMoreMenu';
import { FormProvider } from '../../../components/hook-form';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import useLocales from '../../../hooks/useLocales';
import { getBills, setBillSearch } from '../../../redux/slices/sim/sim.bill';
import { deleteBillAPI, deleteBillsAPI } from '../../../service/sim/bill.service';
import { mediaBaseURL } from '../../../config';

// ----------------------------------------------------------------------

export default function BillList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { bills, totalElements, numberOfElements, search, error } = useSelector((state) => state.bill);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const { translate } = useLocales();
  const TABLE_HEAD = [
    { id: 'id', label: translate('sim.bill.id'), alignRight: false, checked: false, sort: true },
    { id: 'nameUser', label: translate('media.user.name'), alignRight: false, checked: true, sort: true },
    { id: 'roles', label: translate('media.user.roles'), alignRight: false, checked: false, sort: false },
    { id: 'productName', label: translate('sim.product.name'), alignRight: false, checked: true, sort: false, },
    { id: 'productPrice', label: translate('sim.product.price'), alignRight: false, checked: false, sort: false },
    { id: 'categoryName', label: translate('sim.category.name'), alignRight: false, checked: true, sort: false },
    { id: 'quantity', label: translate('sim.bill.quantity'), alignRight: false, checked: true, sort: false },
    { id: 'price', label: translate('sim.bill.price'), alignRight: false, checked: true, sort: false },
    { id: 'createdAt', label: translate('sim.bill.createdAt'), alignRight: false, checked: false, sort: true },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false },
  ];
  // goi lai redux neu search thay doi
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getBills());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = isAsc ? 'desc' : 'asc';

    dispatch(
      setBillSearch({
        ...search,
        orders: [
          {
            order,
            property,
          },
        ],
      })
    );
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = bills.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setBillSearch({
      ...search, currentPage: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (currentPage) => {
    dispatch(setBillSearch({
      ...search, currentPage
    }));
  };
  const handleFilterByName = (keyword) => {
    dispatch(setBillSearch({
      ...search, keyword
    }));
  };

  const handleDelete = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteBill = async () => {
    let resp;
    if (selected.length > 0) resp = await deleteBillsAPI(selected);
    else resp = await deleteBillAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.status === 200) {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getBills());
      setSelected([]);
    } else
      enqueueSnackbar(`${resp.status} - ${resp.msg}`, { variant: 'error' });
  };

  const defaultValues = {
    checkedColumns: TABLE_HEAD.filter(item => item.checked).map(item => item.label),
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch } = methods;

  const { checkedColumns } = watch();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };
  console.log(bills)
  return (
    <Page title={translate('sim.bill.listBill')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('sim.bill.listBill')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.sim'),
              href: PATH_DASHBOARD.sim.bills,
            },
            { name: translate('sim.bill.listBill') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.sim.newBill}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('button.new')}
            </Button>
          }
        />

        <FormProvider methods={methods}>
          <TableFilterSlidebar
            onResetAll={handleResetFilter}
            isOpen={openFilter}
            onOpen={handleOpenFilter}
            onClose={handleCloseFilter}
            columns={TABLE_HEAD.map((item) => item.label)}
          />
        </FormProvider>

        <Card>
          <DataGridListToolbar
            numSelected={selected.length}
            filterName={search.value}
            onFilterName={handleFilterByName}
            onDelete={() => handleDeleteItems()}
            showFilter={handleOpenFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DataGridListHead
                  headLabel={TABLE_HEAD.filter((head) => checkedColumns.indexOf(head.label) > -1)}
                  rowCount={numberOfElements}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {bills.map((row) => {
                    const { id } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                        </TableCell>
                        {TABLE_HEAD.map((head) => {
                          if (checkedColumns.indexOf(head.label) === -1) return null;

                          if (head.id === 'nameUser')
                            return <TableCell key={head.id}>
                              {row.user.name}
                            </TableCell>;
                          
                          if (head.id === 'roles')
                            return <TableCell key={head.id}>
                              {row.user.roles.map(r => r.name).join(',')}
                            </TableCell>;

                          if (head.id === 'productName') {
                            if (row.billItems && Array.isArray(row.billItems)) {
                              const productNames = row.billItems.map(item => item.product.name).join(', ');
                              const productImages = row.billItems.map(item => item.product.image);
                              return (
                                <TableCell sx={{ display: 'flex', alignItems: 'center' }} key={head.id}>
                                <Avatar alt={productImages} title={productImages} src={`${mediaBaseURL}/user/download/${productImages}`} sx={{ mr: 2, alignItems: 'center' }} />
                                <Typography variant="subtitle2" noWrap>
                                  {productNames}
                                </Typography>
                                </TableCell>
                              );
                            }
                          }

                          if (head.id === 'productPrice') {
                            if (row.billItems && Array.isArray(row.billItems)) {
                              const productPrices = row.billItems.map(item => item.product.price).join(', ');
                              return (
                                <TableCell key={head.id}>
                                  {productPrices}
                                </TableCell>
                              );
                            }
                          }

                          if (head.id === 'categoryName') {
                            if (row.billItems && Array.isArray(row.billItems)) {
                              const categoryNames = row.billItems.map(item => item.product.category.name).join(', ');
                              return (
                                <TableCell key={head.id}>
                                  {categoryNames}
                                </TableCell>
                              );
                            }
                          }

                          if (head.id === 'quantity') {
                            if (row.billItems && Array.isArray(row.billItems)) {
                              const quantities = row.billItems.map(item => item.quantity).join(', ');
                              return (
                                <TableCell key={head.id}>
                                  {quantities}
                                </TableCell>
                              );
                            }
                          }

                          if (head.id === 'price') {
                            if (row.billItems && Array.isArray(row.billItems)) {
                              const prices = row.billItems.map(item => item.price).join(', ');
                              return (
                                <TableCell key={head.id}>
                                  {prices}
                                </TableCell>
                              );
                            }
                          }

                          if (head.id === '')
                            return (
                              <TableCell align="right" key={head.id}>
                                <DataGridMoreMenu
                                  pathEdit={`${PATH_DASHBOARD.sim.root}/bill/${id}/edit`}
                                  pathView={`${PATH_DASHBOARD.sim.root}/bill/${id}/view`}
                                  onDelete={() => handleDelete(id)}
                                />
                              </TableCell>
                            );
                          return <TableCell key={head.id}>{row[head.id]}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>

                {numberOfElements === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={checkedColumns.length + 1}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={search.value} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {error && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={checkedColumns.length + 1}>
                        <Box sx={{ py: 3 }}>
                          <ErrorOccur error={error} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={search.size}
            page={search.currentPage}
            onPageChange={(event, value) => handleChangePage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <ConfirmDialog
          values={{ title: translate('message.dialogDeleteTitle'), content: translate('message.dialogDeleteContent') }}
          onClose={() => setOpen(false)}
          isOpen={open}
          onSubmit={confirmDeleteBill}
        />
      </Container>
    </Page>
  );
}