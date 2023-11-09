import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Grid, Stack, TextField, Typography, styled } from '@mui/material';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { mediaBaseURL } from '../../../config';
import useAuth from '../../../hooks/useAuth';
import { getCategories, setCategorySearch } from '../../../redux/slices/sim/sim.category';
import { dispatch, useSelector } from '../../../redux/store';
import { createProductAPI, updateProductAPI } from '../../../service/sim/product.service';

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


const STATUS_OPTIONS = ["ACTIVE", "HOLD", "SOLD"];

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role?.name;
};

export default function ProductNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const currentRole = useCurrentRole();

  const { categories, search: searchCategory, isLoading: isLoadingCategory } = useSelector((state) => state.category);
  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required(translate('validation.required')),
    description: Yup.string().required(translate('validation.required')),
    price: Yup.number().required(translate('validation.required')),
    category: Yup.object().required(translate('validation.required')),
    file: Yup.mixed().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentItem?.id || '',
      name: currentItem?.name || '',
      description: currentItem?.description || '',
      price: currentItem?.price || '',
      category: currentItem?.category || '',
      file: currentItem?.file && `${mediaBaseURL}/product/download/${currentItem?.file}` || null,
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
      dispatch(getCategories());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchCategory]);

  const handleFilterTitleCategory = (value) => {
    dispatch(setCategorySearch({ ...searchCategory, value }));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue('file', Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('id', `${data.id}`);
    formData.append('name', `${data.name}`);
    formData.append('description', `${data.description}`);
    formData.append('price', `${data.price}`);
    formData.append(`category.id`, `${data.category?.id}`);

    if (data.file) {
      formData.append('file', data.file);
    }
    let resp;
    if (isEdit) resp = await updateProductAPI(formData);
    else resp = await createProductAPI(formData);

    if (resp.status === 200) {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.sim.products);
    } else enqueueSnackbar(`${resp.status} - ${resp.msg}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label={translate('sim.product.name')} disabled={isView} />
                <RHFTextField name="description" label={translate('sim.product.description')} multiline rows={4} disabled={isView} />
                <RHFTextField name="price" label={translate('sim.product.price')} disabled={isView} />
                <div>
                  <LabelStyle>{translate('sim.post.featureImage')}</LabelStyle>
                  <RHFUploadSingleFile
                    disabled={isView}
                    name="file"
                    showPreview
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </div>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      disabled={isView}
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={categories.map(({ id, name }) => ({ id, name }))}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingCategory}
                      onInputChange={(event, value) => {
                        handleFilterTitleCategory(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField label={translate('sim.product.category')} {...params} error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />

                {isView ? (
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.sim.root}/product/${currentItem?.id}/edit`}
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
