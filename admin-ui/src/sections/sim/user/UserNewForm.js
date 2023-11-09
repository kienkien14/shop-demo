import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { format } from 'date-fns';
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/sim/sim.role';
import { dispatch, useSelector } from '../../../redux/store';
import { createMediaUserAPI } from '../../../service/sim/user.service';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

export default function UserNewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { roles, search: searchRole, isLoading: isLoadingRole } = useSelector((state) => state.mediaRole);
  const validateEmail = (email) => (String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required(translate('validation.required')),
    roles: Yup.object().required(translate('validation.required')),
    email: Yup.string().test('required', translate('validation.emailError'), (value) => (validateEmail(value))),
    username: Yup.string().required(translate('validation.required')),
    password: Yup.string().required(translate('validation.required')),
    birthdate: Yup.date().nullable(),
    file: Yup.mixed().required(translate('validation.required')),

  });

  const defaultValues = useMemo(
    () => ({
      name: "",
      email: "",
      username: "",
      password: "",
      birthdate: "",
      file: null,
      roles: ""
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaRoles());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterRole = (value) => {
    dispatch(setMediaRoleSearch({ ...searchRole, value }));
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
    formData.append('name', `${data.name}`);
    formData.append('email', `${data.email}`);
    formData.append('username', `${data.username}`);
    formData.append('password', `${data.password}`);
    formData.append('roles[0].id', `${data.roles?.id}`);
    if (data.birthdate) {
      const dateFormat = format(new Date(data.birthdate), 'dd/MM/yyyy');
      formData.append('birthdate', dateFormat);
    }
    if (data.file) {
      formData.append('file', data.file);
    }

    const resp = await createMediaUserAPI(formData);
    if (resp.status === 200) {
      reset();
      enqueueSnackbar(translate('message.createSuccess'));
      navigate(PATH_DASHBOARD.sim.users);
    } else enqueueSnackbar(`${resp.status} - ${resp.msg}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label={translate('media.user.name')} />
              <RHFTextField name="username" label={translate('media.user.username')} />
              <RHFTextField name="password" type="password" label={translate('media.user.password')} />
              <RHFTextField name="email" label={translate('media.user.email')} />
              <RHFTextField type="date" name="birthdate" />

              <div>
                <LabelStyle>{translate('media.user.image')}</LabelStyle>
                <RHFUploadSingleFile
                  name="file"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </div>

              <Controller
                name="roles"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    options={roles.map(({ id, name }) => ({ id, name }))}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingRole}
                    onInputChange={(_, value) => {
                      handleFilterRole(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label={translate('media.user.roles')}
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {translate('button.new')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
