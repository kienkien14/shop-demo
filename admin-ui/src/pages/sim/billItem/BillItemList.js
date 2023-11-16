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
import { getBillItems, setBillItemSearch } from '../../../redux/slices/sim/sim.billItem';
import { deleteBillItemAPI, deleteBillItemsAPI } from '../../../service/sim/billItem.service';
import { mediaBaseURL } from '../../../config';

// ----------------------------------------------------------------------

export default function BillItemList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { billItems, totalElements, numberOfElements, search, error } = useSelector((state) => state.billItem);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const { translate } = useLocales();
  const TABLE_HEAD = [
    { id: 'id', label: translate('sim.billItem.id'), alignRight: false, checked: false, sort: true },
    { id: 'productName', label: translate('sim.product.name'), alignRight: false, checked: true, sort: true },
    { id: 'description', label: translate('sim.product.description'), alignRight: false, checked: true, sort: false },
    { id: 'categoryName', label: translate('sim.category.name'), alignRight: false, checked: true, sort: false },
    { id: 'createdAt', label: translate('sim.product.createdAt'), alignRight: false, checked: true, sort: true },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false },
  ];
  // goi lai redux neu search thay doi
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getBillItems());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = isAsc ? 'desc' : 'asc';

    dispatch(
      setBillItemSearch({
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
      const selected = billItems.map((n) => n.id);
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
    dispatch(setBillItemSearch({
      ...search, currentPage: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (currentPage) => {
    dispatch(setBillItemSearch({
      ...search, currentPage
    }));
  };
  const handleFilterByName = (keyword) => {
    dispatch(setBillItemSearch({
      ...search, keyword
    }));
  };

  const handleDelete = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteBillItem = async () => {
    let resp;
    if (selected.length > 0) resp = await deleteBillItemsAPI(selected);
    else resp = await deleteBillItemAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.status === 200) {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getBillItems());
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
  console.log(billItems);
  return (
    <Page title={translate('sim.billItem.listBillItem')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('sim.billItem.listBillItem')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.sim'),
              href: PATH_DASHBOARD.sim.billItems,
            },
            { name: translate('sim.billItem.listBillItem') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.sim.newBillItem}
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
                  {billItems.map((row) => {
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

                          if (head.id === 'productName')
                            return <TableCell sx={{ display: 'flex', alignItems: 'center' }} key={head.id}>
                              <Avatar alt={row.product.image} title={row.product.image} src={`${mediaBaseURL}/product/download/${row.product.image}`} sx={{ mr: 2, alignItems: 'center' }} />
                              <Typography variant="subtitle2" noWrap>
                                {row.product.name}
                              </Typography>
                            </TableCell>;

                          if (head.id === 'description')
                            return <TableCell key={head.id}>
                              {row.product.description}
                            </TableCell>;

                          if (head.id === 'categoryName')
                            return <TableCell key={head.id}>
                              {row.product.description}
                            </TableCell>;

                          if (head.id === 'createdAt')
                            return <TableCell key={head.id}>
                              {row.product.createdAt}
                            </TableCell>;

                          if (head.id === '')
                            return (
                              <TableCell align="right" key={head.id}>
                                <DataGridMoreMenu
                                  pathEdit={`${PATH_DASHBOARD.sim.root}/billItem/${id}/edit`}
                                  pathView={`${PATH_DASHBOARD.sim.root}/billItem/${id}/view`}
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
          onSubmit={confirmDeleteBillItem}
        />
      </Container>
    </Page>
  );
}