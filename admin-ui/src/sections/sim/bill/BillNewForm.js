import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Grid, Stack, TextField } from '@mui/material';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import { getProducts, setProductSearch } from '../../../redux/slices/sim/sim.product';
import { getMediaUsers, setMediaUserSearch } from '../../../redux/slices/sim/sim.user';
import { dispatch, useSelector } from '../../../redux/store';
import { createBillAPI, updateBillAPI } from '../../../service/sim/bill.service';

// ----------------------------------------------------------------------

BillNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

const STATUS_OPTIONS = ["ACTIVE", "HOLD", "SOLD"];

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};

export default function BillNewForm({ isEdit, isView, currentItem }) {
  console.log(currentItem)
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const currentRole = useCurrentRole();

  const { users, search: searchUser, isLoading: isLoadingUser } = useSelector((state) => state.mediaUser);
  const { products, search: searchProduct, isLoading: isLoadingProduct } = useSelector((state) => state.product);
  console.log(searchUser);
  console.log(searchProduct);
  const NewItemSchema = Yup.object().shape({
    user: Yup.object().required(translate('validation.required')),
    product: Yup.object().required(translate('validation.required')),
    quantity: Yup.number().required(translate('validation.required')),
    price: Yup.number().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentItem?.id || '',
      user: currentItem?.user || '',
      product: currentItem?.product?.id || '',
      quantity: currentItem?.quantity || '',
      price: currentItem?.price || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaUsers());
      dispatch(getProducts());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchUser, searchProduct]);

  const handleFilterTitleUser = (value) => {
    dispatch(setMediaUserSearch({ ...searchUser, value }));
  };

  const handleFilterTitleProduct = (value) => {
    dispatch(setProductSearch({ ...searchProduct, value }));
  };

  const onSubmit = async (data) => {
   
    let resp;
    if (isEdit) resp = await updateBillAPI(data);
    else resp = await createBillAPI(data);

    if (resp.status === 200) {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.bills);
    } else enqueueSnackbar(`${resp.status} - ${resp.msg}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="user"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      disabled={isView}
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={users.map(({ id, name }) => ({ id, name }))}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingUser}
                      onInputChange={(event, value) => {
                        handleFilterTitleUser(value);
                      }}
                      renderItems={(value, getItemProps) =>
                        value.map((option, index) => (
                          <Chip {...getItemProps({ index })} key={option.id} size="small" label={option.name} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label={translate('media.user.name')} {...params} error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
                <Controller
                  name="product"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      disabled={isView}
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={products.map(({ id, name }) => ({ id, name }))}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingProduct}
                      onInputChange={(event, value) => {
                        handleFilterTitleProduct(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label={translate('sim.product.name')} {...params} error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
                <RHFTextField name="quantity" label={translate('sim.bill.quantity')} disabled={isView} />
                <RHFTextField name="price" label={translate('sim.bill.price')} disabled={isView} />
                {isView ? (
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.sim.root}/bill/${currentItem?.id}/edit`}
                    size="large"
                    startIcon={<Iconify icon={'eva:edit-fill'} />}
                  >
                    {translate('button.edit')}
                  </Button>
                ) : (
                  <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                    {!isEdit ? translate('button.new') : translate('button.save')}
                  </LoadingButton>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
